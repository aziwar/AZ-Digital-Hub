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
  project_type: string;
  budget_range: string;
  message: string;
  phone?: string;
  recaptchaToken?: string;
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

  if (!data.project_type || typeof data.project_type !== 'string' || data.project_type.trim().length === 0) {
    errors.push('Project type is required.');
  }

  if (!data.budget_range || typeof data.budget_range !== 'string' || data.budget_range.trim().length === 0) {
    errors.push('Budget range is required.');
  }

  if (!data.message || typeof data.message !== 'string' || data.message.trim().length < 20) {
    errors.push('Message is required and must be at least 20 characters long.');
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
      // Rate limiting unavailable (Upstash not configured) - proceed without it
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

    const { isValid, errors } = validateContactForm(body);

    if (!isValid) {
      return NextResponse.json({ message: 'Validation failed', errors }, { status: 400, headers: { ...(rateLimitResult ? getRateLimitHeaders(rateLimitResult) : {}) } });
    }

    // reCAPTCHA verification (optional - skipped if not configured)
    const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (recaptchaSecretKey && body.recaptchaToken) {
      const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
      const recaptchaResponse = await fetch(recaptchaVerifyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${recaptchaSecretKey}&response=${body.recaptchaToken}`,
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
        project_type: body.project_type,
        budget_range: body.budget_range,
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
