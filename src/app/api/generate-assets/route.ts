import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import {
  generateHeadshots,
  generateBrandLogos,
  generateServiceGraphics,
  calculateGenerationCost,
  validateOpenAIConnection,
  strictRateLimiter,
  getClientIdentifier,
  checkRateLimit,
  getRateLimitHeaders
} from '@/lib'

// Type-safe request interface
interface GenerateAssetsRequest {
  brandName: string;
  services: string[];
  headshotCount?: number;
  logoCount?: number;
  serviceCount?: number;
  quality?: 'standard' | 'hd';
}

// Type-safe response interface
interface GenerateAssetsResponse {
  success: boolean;
  data?: {
    headshots: string[];
    logos: string[];
    serviceGraphics: Record<string, string[]>;
    totalCost: number;
    imageCount: number;
  };
  error?: string;
  validationErrors?: string[];
}

// Input validation with Context7-verified constraints
function validateRequest(body: unknown): { isValid: boolean; errors: string[]; data?: GenerateAssetsRequest } {
  const errors: string[] = [];
  const typedBody = body as Record<string, unknown>;
  
  if (!typedBody.brandName || typeof typedBody.brandName !== 'string' || typedBody.brandName.trim().length === 0) {
    errors.push('brandName is required and must be a non-empty string');
  }
  
  if (!typedBody.services || !Array.isArray(typedBody.services) || typedBody.services.length === 0) {
    errors.push('services must be a non-empty array of strings');
  }
  
  if (typedBody.services && Array.isArray(typedBody.services)) {
    const invalidServices = typedBody.services.filter((service: unknown) => typeof service !== 'string' || (service as string).trim().length === 0);
    if (invalidServices.length > 0) {
      errors.push('All services must be non-empty strings');
    }
  }
  
  // Validate optional counts
  const counts = ['headshotCount', 'logoCount', 'serviceCount'];
  counts.forEach(count => {
    if (typedBody[count] !== undefined) {
      if (!Number.isInteger(typedBody[count]) || (typedBody[count] as number) < 0 || (typedBody[count] as number) > 50) {
        errors.push(`${count} must be an integer between 0 and 50`);
      }
    }
  });
  
  // Validate quality parameter
  if (typedBody.quality && !['standard', 'hd'].includes(typedBody.quality as string)) {
    errors.push('quality must be either "standard" or "hd"');
  }
  
  if (errors.length > 0) {
    return { isValid: false, errors };
  }
  
  return {
    isValid: true,
    errors: [],
    data: {
      brandName: (typedBody.brandName as string).trim(),
      services: (typedBody.services as string[]).map((s: string) => s.trim()),
      headshotCount: (typedBody.headshotCount as number) || 4,
      logoCount: (typedBody.logoCount as number) || 8,
      serviceCount: (typedBody.serviceCount as number) || 12,
      quality: (typedBody.quality as 'standard' | 'hd') || 'standard'
    }
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<GenerateAssetsResponse>> {
  try {
    // Rate limiting check (CRITICAL: protects against OpenAI API cost abuse)
    const clientId = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(strictRateLimiter, clientId);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
          validationErrors: [
            'Too many requests. Limit: 5 requests per 10 minutes.',
            `Remaining: ${rateLimitResult.remaining}`,
            `Reset at: ${new Date(rateLimitResult.reset).toISOString()}`
          ]
        },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult)
        }
      );
    }

    // Environment validation
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'OPENAI_API_KEY environment variable not configured' },
        { status: 500, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validation = validateRequest(body);
    
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', validationErrors: validation.errors },
        { status: 400 }
      );
    }
    
    const { brandName, services, headshotCount, logoCount, serviceCount } = validation.data!;
    
    // Validate OpenAI connection
    const isConnected = await validateOpenAIConnection();
    if (!isConnected) {
      return NextResponse.json(
        { success: false, error: 'OpenAI API connection failed' },
        { status: 503 }
      );
    }
    
    // Calculate and validate cost
    const totalCost = calculateGenerationCost(headshotCount!, logoCount!, serviceCount!);
    const totalImages = headshotCount! + logoCount! + serviceCount!;
    
    // Generate assets with error handling for each type
    const results = await Promise.allSettled([
      headshotCount! > 0 ? generateHeadshots('', headshotCount!) : Promise.resolve([]),
      logoCount! > 0 ? generateBrandLogos(brandName, logoCount!) : Promise.resolve([]),
      serviceCount! > 0 ? generateServiceGraphics(services, serviceCount!) : Promise.resolve({})
    ]);
    
    // Process results and handle partial failures
    const [headshotsResult, logosResult, serviceGraphicsResult] = results;
    
    const response: GenerateAssetsResponse = {
      success: true,
      data: {
        headshots: headshotsResult.status === 'fulfilled' ? headshotsResult.value : [],
        logos: logosResult.status === 'fulfilled' ? logosResult.value : [],
        serviceGraphics: serviceGraphicsResult.status === 'fulfilled' ? serviceGraphicsResult.value : {},
        totalCost,
        imageCount: totalImages
      }
    };
    
    // Check for partial failures
    const failures = results.filter(result => result.status === 'rejected');
    if (failures.length > 0) {
      response.error = `Partial success: ${failures.length} generation tasks failed`;
    }

    return NextResponse.json(response, {
      status: 200,
      headers: getRateLimitHeaders(rateLimitResult)
    });
    
  } catch (err) {
    return NextResponse.json(
      { 
        success: false, 
        error: err instanceof Error ? err.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// Type-safe GET endpoint for cost estimation
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Rate limiting check (uses same strict limits as POST)
    const clientId = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(strictRateLimiter, clientId);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult)
        }
      );
    }

    const { searchParams } = new URL(request.url);
    
    const headshotCount = parseInt(searchParams.get('headshotCount') || '4');
    const logoCount = parseInt(searchParams.get('logoCount') || '8');
    const serviceCount = parseInt(searchParams.get('serviceCount') || '12');
    const qualityParam = searchParams.get('quality') || 'standard';
    
    if (!['standard', 'hd'].includes(qualityParam)) {
      return NextResponse.json(
        { error: 'Invalid quality parameter' },
        { status: 400 }
      );
    }
    
    const totalCost = calculateGenerationCost(headshotCount, logoCount, serviceCount);
    const totalImages = headshotCount + logoCount + serviceCount;

    return NextResponse.json({
      cost: totalCost,
      imageCount: totalImages,
      breakdown: {
        headshots: { count: headshotCount, cost: headshotCount * 0.04 },
        logos: { count: logoCount, cost: logoCount * 0.04 },
        services: { count: serviceCount, cost: serviceCount * 0.04 }
      },
      quality: qualityParam,
      pricePerImage: qualityParam === 'hd' ? 0.08 : 0.04
    }, {
      headers: getRateLimitHeaders(rateLimitResult)
    });
    
  } catch {
    return NextResponse.json(
      { error: 'Failed to calculate cost' },
      { status: 500 }
    );
  }
}
