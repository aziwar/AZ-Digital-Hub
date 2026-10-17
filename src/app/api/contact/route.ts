import emailjs from '@emailjs/nodejs';
import { NextRequest, NextResponse } from 'next/server';

import {
  strictRateLimiter,
  getClientIdentifier,
  checkRateLimit,
  getRateLimitHeaders,
  type RateLimitResult
} from '@/lib';

// Type-safe request interface for validation
interface ContactFormRequest {
  name: string;
  email: string;
  company?: string;
  project_type?: string;
  budget_range?: string;
  message: string;
  phone?: string;
  recaptchaToken?: string;
  company_website?: string; // honeypot: must stay empty
}

// Server-side input validation
const validateContactForm = (data: Partial<ContactFormRequest>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters long.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || typeof data.email !== 'string' || !emailRegex.test(data.email)) {
    errors.push('A valid email address is required.');
  }

  if (!data.message || typeof data.message !== 'string' || data.message.trim().length < 20) {
    errors.push('Message is required and must be at least 20 characters long.');
  }

  const maxLengths: Partial<Record<keyof ContactFormRequest, number>> = {
    name: 100, email: 254, company: 200, phone: 32, project_type: 100, budget_range: 100, message: 5000,
  };
  for (const [field, max] of Object.entries(maxLengths) as [keyof ContactFormRequest, number][]) {
    const value = data[field];
    if (value !== undefined && (typeof value !== 'string' || value.length > max)) {
      errors.push(`${field} must be text of at most ${max} characters.`);
    }
  }

  // Company field is optional, no validation needed if empty.
  // Phone validation (optional field)
  if (data.phone && typeof data.phone === 'string' && data.phone.trim().length > 0 && !/^\+?[1-9]\d{1,14}$/.test(data.phone.replace(/\s/g, ''))) {
    errors.push('Invalid phone number format.');
  }

  return { isValid: errors.length === 0, errors };
};

export async function POST(req: NextRequest) {
  try {
    // --- Rate Limiting Check (optional - skipped if Upstash not configured) ---
    let rateLimitResult: RateLimitResult | null = null;
    try {
      const clientId = getClientIdentifier(req);
      rateLimitResult = await checkRateLimit(strictRateLimiter, clientId);

      if (!rateLimitResult.success) {
        return NextResponse.json(
          {
            message: 'Rate limit exceeded. Please try again later.',
            errors: [
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
    } catch {
      // Rate limiting unavailable (Upstash not configured or unreachable):
      // fail closed in production, allow in development
      // eslint-disable-next-line no-console
      console.error('[contact] Rate limiting unavailable: UPSTASH_REDIS_REST_URL/TOKEN not configured or unreachable.');
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { message: 'Contact form is temporarily unavailable.' },
          { status: 503 }
        );
      }
    }
    // --- End Rate Limiting Check ---

    let body: ContactFormRequest;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400, headers: { ...(rateLimitResult ? getRateLimitHeaders(rateLimitResult) : {}) } }
      );
    }

    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400, headers: { ...(rateLimitResult ? getRateLimitHeaders(rateLimitResult) : {}) } }
      );
    }

    // Honeypot: real users never fill this hidden field. Pretend success to bots.
    if (typeof body.company_website === 'string' && body.company_website.trim().length > 0) {
      // eslint-disable-next-line no-console
      console.warn('[contact] Honeypot triggered; submission dropped.');
      return NextResponse.json({ message: 'Message sent successfully' }, { status: 200 });
    }

    const { isValid, errors } = validateContactForm(body);

    if (!isValid) {
      return NextResponse.json({ message: 'Validation failed', errors }, { status: 400, headers: { ...(rateLimitResult ? getRateLimitHeaders(rateLimitResult) : {}) } });
    }

    // reCAPTCHA verification: required whenever RECAPTCHA_SECRET_KEY is configured
    const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (recaptchaSecretKey) {
      const token = typeof body.recaptchaToken === 'string' ? body.recaptchaToken : '';
      if (!token) {
        return NextResponse.json(
          { message: 'reCAPTCHA verification failed. Please try again.' },
          { status: 403, headers: { ...(rateLimitResult ? getRateLimitHeaders(rateLimitResult) : {}) } }
        );
      }
      const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret: recaptchaSecretKey, response: token }).toString(),
      });
      const recaptchaResult = await recaptchaResponse.json();
      if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
        // eslint-disable-next-line no-console
        console.warn('reCAPTCHA verification failed:', recaptchaResult['error-codes']);
        return NextResponse.json(
          { message: 'reCAPTCHA verification failed. Please try again.' },
          { status: 403, headers: { ...(rateLimitResult ? getRateLimitHeaders(rateLimitResult) : {}) } }
        );
      }
    }

    // Retrieve EmailJS credentials from environment variables
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY;

    if (!serviceId || !templateId || !publicKey || !privateKey) {
      // eslint-disable-next-line no-console
      console.error('EmailJS environment variables not configured.');
      return NextResponse.json({ message: 'Email service configuration error' }, { status: 500, headers: { ...(rateLimitResult ? getRateLimitHeaders(rateLimitResult) : {}) } });
    }

    await emailjs.send(
      serviceId,
      templateId,
      {
        from_name: body.name,
        from_email: body.email,
        company: body.company,
        project_type: body.project_type || 'Not specified',
        budget_range: body.budget_range || 'Not specified',
        message: body.message,
        phone: body.phone,
        to_name: 'Ahmed Zewar' // This could also be an env var if dynamic
      },
      {
        publicKey: publicKey,
        privateKey: privateKey,
      }
    );

    return NextResponse.json({ message: 'Message sent successfully' }, { status: 200, headers: { ...(rateLimitResult ? getRateLimitHeaders(rateLimitResult) : {}) } });

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Contact form API error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
