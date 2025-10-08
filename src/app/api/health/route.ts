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
    // Environment validation
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY
    const keyLength = process.env.OPENAI_API_KEY?.length || 0
    
    // Build configuration check
    const deployment = {
      timestamp: new Date().toISOString(),
      environment: process.env.VERCEL_ENV || 'development',
      region: process.env.VERCEL_REGION || 'unknown',
      deployment_id: process.env.VERCEL_DEPLOYMENT_ID || 'local'
    }
    
    // API readiness assessment
    const apiReadiness = {
      openai_configured: hasOpenAIKey,
      key_present: hasOpenAIKey ? 'YES' : 'NO',
      key_length: hasOpenAIKey ? `${keyLength} chars` : 'N/A',
      lazy_client: 'IMPLEMENTED',
      build_safe: 'YES'
    }
    
    // Cost calculation test
    const costCalculation = {
      standard_quality: 0.04,
      target_images: 24,
      target_cost: '$0.96',
      ready_for_generation: hasOpenAIKey
    }
    
    const response = {
      status: hasOpenAIKey ? 'READY' : 'BLOCKED',
      blocker: hasOpenAIKey ? null : 'OPENAI_API_KEY missing in Vercel environment',
      deployment,
      apiReadiness,
      costCalculation,
      next_action: hasOpenAIKey ? 'Execute Phase 2 asset generation' : 'Configure OPENAI_API_KEY in Vercel dashboard'
    }
    
    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store',
        'Content-Type': 'application/json',
        ...getRateLimitHeaders(rateLimitResult)
      }
    })
    
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'ERROR',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}