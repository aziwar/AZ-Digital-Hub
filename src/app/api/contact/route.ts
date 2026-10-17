import { NextRequest, NextResponse } from 'next/server';

import {
  strictRateLimiter,
  memoryStrictRateLimiter,
  getClientIdentifier,
  checkRateLimit,
  getRateLimitHeaders,
  type RateLimitResult
} from '@/lib';
import { getContactEmailProvider, isUpstashConfigured } from '@/lib/contactDelivery';
import { sendContactEmail } from '@/lib/contactEmail';

// Type-safe request interface for validation
interface ContactFormRequest {
  name: string;
  email: string;
  company?: string;
  project_type?: string;
  budget_range?: string;
  message: string;
  phone?: string;
  locale?: string;
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
    name: 100, email: 254, company: 200, phone: 32, project_type: 100, budget_range: 100, message: 5000, locale: 10,
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
    // --- Rate Limiting Check: Upstash when configured, else in-memory (5 per 10 min per IP) ---
    let rateLimitResult: RateLimitResult;
    const clientId = getClientIdentifier(req);
    if (isUpstashConfigured()) {
      try {
        rateLimitResult = await checkRateLimit(strictRateLimiter, clientId);
      } catch {
        // Upstash unreachable: fall back to the in-memory limiter instead of failing
        // eslint-disable-next-line no-console
        console.error('[contact] Upstash rate limiting unreachable; using in-memory limiter.');
        rateLimitResult = await checkRateLimit(memoryStrictRateLimiter, clientId);
      }
    } else {
      rateLimitResult = await checkRateLimit(memoryStrictRateLimiter, clientId);
    }

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
    // --- End Rate Limiting Check ---

    let body: ContactFormRequest;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
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
      return NextResponse.json({ message: 'Validation failed', errors }, { status: 400, headers: getRateLimitHeaders(rateLimitResult) });
    }

    // reCAPTCHA verification: required whenever RECAPTCHA_SECRET_KEY is configured
    const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (recaptchaSecretKey) {
      const token = typeof body.recaptchaToken === 'string' ? body.recaptchaToken : '';
      if (!token) {
        return NextResponse.json(
          { message: 'reCAPTCHA verification failed. Please try again.' },
          { status: 403, headers: getRateLimitHeaders(rateLimitResult) }
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
          { status: 403, headers: getRateLimitHeaders(rateLimitResult) }
        );
      }
    }

    if (!getContactEmailProvider()) {
      // eslint-disable-next-line no-console
      console.error('[contact] No email provider configured (Cloudflare Email Service or EmailJS).');
      return NextResponse.json({ message: 'Email service configuration error' }, { status: 503, headers: getRateLimitHeaders(rateLimitResult) });
    }

    await sendContactEmail({
      name: body.name,
      email: body.email,
      company: body.company,
      phone: body.phone,
      project_type: body.project_type,
      budget_range: body.budget_range,
      message: body.message,
      locale: body.locale,
    });

    return NextResponse.json({ message: 'Message sent successfully' }, { status: 200, headers: getRateLimitHeaders(rateLimitResult) });

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Contact form API error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
