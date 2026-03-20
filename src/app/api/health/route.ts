import type { NextRequest } from "next/server"
import { NextResponse } from 'next/server'

import {
  standardRateLimiter,
  getClientIdentifier,
  checkRateLimit,
  getRateLimitHeaders
} from '@/lib'

// Context7-validated environment diagnostic endpoint
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Rate limiting check (60 requests per minute)
    const clientId = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(standardRateLimiter, clientId);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          status: 'RATE_LIMITED',
          error: 'Too many requests. Please try again later.',
          timestamp: new Date().toISOString()
        },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult)
        }
      );
    }
    const isHealthy = !!process.env.OPENAI_API_KEY;

    const response = {
      status: isHealthy ? 'OK' : 'SERVICE_UNAVAILABLE',
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(response, {
      status: isHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store',
        'Content-Type': 'application/json',
        ...getRateLimitHeaders(rateLimitResult)
      }
    });
    
  } catch {
    return NextResponse.json(
      {
        status: 'ERROR',
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}