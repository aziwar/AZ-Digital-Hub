'use client';

import React, { useState, useEffect } from 'react';

import { EMAIL, LINKEDIN_DISPLAY, LINKEDIN_URL, WHATSAPP_NUMBER, PHONE_DISPLAY } from '@/components/contactDetails';
import { createTranslator, type MessageTree } from '@/lib/messages';

// Extend Window interface to include grecaptcha
declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

type FieldName = 'name' | 'email' | 'company' | 'phone' | 'project_type' | 'message';

const emptyForm: Record<FieldName, string> = {
  name: '',
  email: '',
  company: '',
  phone: '',
  project_type: '',
  message: ''
};

// The API still expects these two fields; the form no longer asks for a budget.
const NOT_SPECIFIED = 'Not specified';

const inputBase =
  'w-full px-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-hidden transition-colors duration-200 focus-enhanced';

interface EnhancedContactProps {
  locale: string;
  /** The Contact namespace (plain strings); the rich title is formatted on the server */
  messages: MessageTree;
  title: React.ReactNode;
}

const EnhancedContact: React.FC<EnhancedContactProps> = ({ locale, messages, title }) => {
  const t = createTranslator(messages, 'Contact');
  const [formData, setFormData] = useState<Record<FieldName, string>>(emptyForm);
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [fieldTouched, setFieldTouched] = useState<Record<string, boolean>>({});

  // Load reCAPTCHA script
  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) {
      return;
    }

    if (typeof window.grecaptcha !== 'undefined') {
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}&hl=${locale}`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [locale]);

  const validateField = (name: FieldName, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return t('form.fields.name.errors.required');
        if (value.trim().length < 2) return t('form.fields.name.errors.minLength');
        return '';
      case 'email':
        if (!value.trim()) return t('form.fields.email.errors.required');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return t('form.fields.email.errors.invalid');
        return '';
      case 'message':
        if (!value.trim()) return t('form.fields.message.errors.required');
        if (value.trim().length < 20) return t('form.fields.message.errors.minLength');
        return '';
      case 'phone':
        if (value && !/^\+?[1-9]\d{1,14}$/.test(value.replace(/\s/g, ''))) {
          return t('form.fields.phone.errors.invalid');
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const name = e.target.name as FieldName;
    const { value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldTouched[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const name = e.target.name as FieldName;
    setFieldTouched(prev => ({ ...prev, [name]: true }));
    setFieldErrors(prev => ({ ...prev, [name]: validateField(name, e.target.value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    (Object.keys(formData) as FieldName[]).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) errors[key] = error;
    });

    setFieldErrors(errors);
    setFieldTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      let recaptchaToken = '';
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      if (siteKey && window.grecaptcha) {
        // execute() is only safe once the script signals ready
        await new Promise<void>(resolve => window.grecaptcha.ready(resolve));
        recaptchaToken = await window.grecaptcha.execute(siteKey, { action: 'contact_form_submit' });
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          project_type: formData.project_type || NOT_SPECIFIED,
          budget_range: NOT_SPECIFIED,
          locale,
          company_website: honeypot,
          recaptchaToken
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData(emptyForm);
        setFieldTouched({});
      } else {
        // Server messages are English-only; always show the localized error
        setSubmitStatus('error');
        setFieldErrors({ general: t('form.status.error.message') });
      }
    } catch {
      setSubmitStatus('error');
      setFieldErrors({ general: t('form.status.error.message') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectTypes = t.raw('form.fields.projectType.options') as string[];
  const nextSteps = t.raw('nextSteps.items') as string[];

  const fieldClass = (name: FieldName) =>
    `${inputBase} ${fieldErrors[name] ? 'border-red-500' : 'border-slate-600 focus:border-purple-500'}`;

  const errorText = (name: FieldName) =>
    fieldErrors[name] ? (
      <p id={`${name}-error`} className="mt-1 text-red-400 text-xs">{fieldErrors[name]}</p>
    ) : null;

  const labelClass = 'block text-sm font-medium text-gray-200 mb-2';

  return (
    <section id="contact" className="py-12 sm:py-16 md:py-20 px-4 bg-linear-to-b/srgb from-slate-900 to-purple-900/30">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            {title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 sm:gap-8 md:gap-12">

          {/* Form */}
          <div className="lg:col-span-3 bg-slate-800/50 backdrop-blur-xs border border-purple-500/30 rounded-xl p-4 sm:p-6 md:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">{t('form.title')}</h3>

            {/* Live region stays mounted so screen readers announce status changes */}
            <div aria-live="polite" aria-atomic="true">
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-600/20 border border-green-500/30 rounded-lg">
                  <h4 className="text-green-300 font-bold mb-1">{t('form.status.success.title')}</h4>
                  <p className="text-green-200 text-sm">{t('form.status.success.message')}</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div role="alert" className="mb-6 p-4 bg-red-600/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-200 text-sm mb-3">{fieldErrors.general || t('form.status.error.message')}</p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('whatsapp.linkText'))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-lg transition-colors duration-200 min-h-[44px] focus-enhanced"
                    >
                      {t('whatsapp.button')}
                      <span dir="ltr">{PHONE_DISPLAY}</span>
                    </a>
                    <a
                      href={`mailto:${EMAIL}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm rounded-lg transition-colors duration-200 min-h-[44px] focus-enhanced"
                    >
                      {t('contactMethods.email')}
                      <span dir="ltr">{EMAIL}</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate aria-busy={isSubmitting}>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className={labelClass}>{t('form.fields.name.label')}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    aria-invalid={!!fieldErrors.name}
                    aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                    className={fieldClass('name')}
                    placeholder={t('form.fields.name.placeholder')}
                  />
                  {errorText('name')}
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>{t('form.fields.email.label')}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    dir="ltr"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                    className={`${fieldClass('email')} rtl:text-right`}
                    placeholder={t('form.fields.email.placeholder')}
                  />
                  {errorText('email')}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="company" className={labelClass}>{t('form.fields.company.label')}</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    autoComplete="organization"
                    value={formData.company}
                    onChange={handleChange}
                    className={fieldClass('company')}
                    placeholder={t('form.fields.company.placeholder')}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className={labelClass}>{t('form.fields.phone.label')}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    dir="ltr"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={!!fieldErrors.phone}
                    aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
                    className={`${fieldClass('phone')} rtl:text-right`}
                    placeholder={t('form.fields.phone.placeholder')}
                  />
                  {errorText('phone')}
                </div>
              </div>

              <div>
                <label htmlFor="project_type" className={labelClass}>{t('form.fields.projectType.label')}</label>
                <select
                  id="project_type"
                  name="project_type"
                  value={formData.project_type}
                  onChange={handleChange}
                  className={fieldClass('project_type')}
                >
                  <option value="">{t('form.fields.projectType.placeholder')}</option>
                  {projectTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className={labelClass}>{t('form.fields.message.label')}</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  rows={5}
                  maxLength={2000}
                  aria-invalid={!!fieldErrors.message}
                  aria-describedby={fieldErrors.message ? 'message-error' : undefined}
                  className={`${fieldClass('message')} resize-y`}
                  placeholder={t('form.fields.message.placeholder')}
                />
                {errorText('message')}
              </div>

              {/* Honeypot: hidden from people and assistive tech; bots tend to fill it */}
              <div
                aria-hidden="true"
                style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap' }}
              >
                <label htmlFor="company_website">{t('form.fields.honeypot.label')}</label>
                <input
                  type="text"
                  id="company_website"
                  name="company_website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-linear-to-r/srgb from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold text-sm sm:text-base rounded-lg shadow-lg focus-enhanced disabled:opacity-60 disabled:cursor-wait min-h-[44px]"
              >
                {submitStatus === 'success'
                  ? t('form.submit.success')
                  : isSubmitting
                    ? t('form.submit.loading')
                    : t('form.submit.idle')}
              </button>
            </form>
          </div>

          {/* Side column */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">

            <div className="bg-slate-800/30 backdrop-blur-xs border border-slate-700 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4">{t('nextSteps.title')}</h3>
              <ol className="space-y-3 text-sm sm:text-base text-gray-300">
                {nextSteps.map((step, index) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-purple-600/30 text-purple-200 text-xs font-bold flex items-center justify-center" aria-hidden="true">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-linear-to-r/srgb from-green-600/15 to-green-800/15 border border-green-500/30 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{t('whatsapp.title')}</h3>
              <p className="text-sm sm:text-base text-gray-300 mb-4">{t('whatsapp.description')}</p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('whatsapp.linkText'))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-sm sm:text-base rounded-lg transition-colors duration-200 min-h-[44px]"
              >
                {t('whatsapp.button')}
                <span dir="ltr">{PHONE_DISPLAY}</span>
              </a>
            </div>

            <div className="space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-white">{t('contactMethods.title')}</h3>
              <dl className="space-y-3 text-sm sm:text-base">
                <div className="p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
                  <dt className="text-xs font-medium text-gray-400">{t('contactMethods.email')}</dt>
                  <dd>
                    <a href={`mailto:${EMAIL}`} dir="ltr" className="text-blue-300 hover:text-blue-200 transition-colors">{EMAIL}</a>
                  </dd>
                </div>
                <div className="p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
                  <dt className="text-xs font-medium text-gray-400">{t('contactMethods.linkedin')}</dt>
                  <dd>
                    <a href={LINKEDIN_URL} dir="ltr" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 transition-colors">
                      {LINKEDIN_DISPLAY}
                    </a>
                  </dd>
                </div>
                <div className="p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
                  <dt className="text-xs font-medium text-gray-400">{t('contactMethods.location.label')}</dt>
                  <dd className="text-white">{t('contactMethods.location.value')}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedContact;
