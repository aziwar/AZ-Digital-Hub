/**
 * Rate Limiting Utility for API Routes
 *
 * Implements Upstash Redis-based rate limiting to protect against API abuse
 * and excessive OpenAI API costs.
 *
 * Security Requirements:
 * - OWASP Top 10 2021: A04:2021 – Insecure Design (CWE-770)
 * - Prevents resource exhaustion attacks
 * - Protects expensive third-party API costs
 *
 * @see https://upstash.com/docs/redis/sdks/ratelimit-ts/overview
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Lazy Redis and rate limiter initialization
let redis: Redis | null = null;
let strictLimiter: Ratelimit | null = null;
let standardLimiter: Ratelimit | null = null;

function getRedisClient(): Redis {
  if (!redis) {
    // Validate environment variables
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      throw new Error(
        'UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be configured in environment variables. ' +
        'Set up Upstash Redis at https://upstash.com/'
      );
    }

    redis = new Redis({
      url,
      token,
    });
  }

  return redis;
}

/**
 * Get strict rate limiter instance (lazy initialization)
 *
 * Limits: 5 requests per 10 minutes
 * Algorithm: Fixed window with sliding window properties
 * Use for: /api/generate-assets (high cost operations)
 */
function getStrictRateLimiter(): Ratelimit {
  if (!strictLimiter) {
    strictLimiter = new Ratelimit({
      redis: getRedisClient(),
      limiter: Ratelimit.fixedWindow(5, '600 s'), // 5 requests per 10 minutes
      prefix: 'ratelimit:strict',
      analytics: true,
    });
  }
  return strictLimiter;
}

/**
 * Get standard rate limiter instance (lazy initialization)
 *
 * Limits: 60 requests per minute
 * Algorithm: Sliding window for smooth distribution
 * Use for: /api/health, general endpoints
 */
function getStandardRateLimiter(): Ratelimit {
  if (!standardLimiter) {
    standardLimiter = new Ratelimit({
      redis: getRedisClient(),
      limiter: Ratelimit.slidingWindow(60, '60 s'), // 60 requests per minute
      prefix: 'ratelimit:standard',
      analytics: true,
    });
  }
  return standardLimiter;
}

// Export lazy getters instead of direct instances
export const strictRateLimiter = {
  limit: async (identifier: string) => getStrictRateLimiter().limit(identifier)
};

export const standardRateLimiter = {
  limit: async (identifier: string) => getStandardRateLimiter().limit(identifier)
};

/**
 * Rate limit response interface
 */
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Get client identifier from request
 * Priority: X-Forwarded-For > X-Real-IP > fallback to localhost
 *
 * @param request - Next.js request object
 * @returns Client IP address or identifier
 */
export function getClientIdentifier(request: Request): string {
  const headers = request.headers;

  // Try X-Forwarded-For (Vercel, most proxies)
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }

  // Try X-Real-IP (some proxies)
  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  // Fallback to localhost (development)
  return '127.0.0.1';
}

/**
 * Apply rate limiting to a request and return standardized headers
 *
 * @param rateLimiter - The rate limiter instance to use
 * @param identifier - Client identifier (typically IP address)
 * @returns Rate limit result with standardized response headers
 */
export async function checkRateLimit(
  rateLimiter: { limit: (id: string) => Promise<{ success: boolean; limit: number; remaining: number; reset: number }> },
  identifier: string
): Promise<RateLimitResult> {
  const { success, limit, remaining, reset } = await rateLimiter.limit(identifier);

  return {
    success,
    limit,
    remaining,
    reset,
  };
}

/**
 * Generate standardized rate limit headers for HTTP responses
 *
 * @param result - Rate limit result from checkRateLimit
 * @returns Headers object for NextResponse
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  };
}