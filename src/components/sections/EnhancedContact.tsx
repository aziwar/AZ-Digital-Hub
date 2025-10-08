'use client';

import emailjs from '@emailjs/browser';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

const EnhancedContact: React.FC = () => {
  const t = useTranslations('Contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    project_type: '',
    budget_range: '',
    message: '',
    phone: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string>('');
  const [fieldTouched, setFieldTouched] = useState<Record<string, boolean>>({});

  // Real-time validation functions
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return t('form.fields.name.errors.required');
        if (value.trim().length < 2) return t('form.fields.name.errors.minLength');
        return '';
      case 'email':
        if (!value.trim()) return t('form.fields.email.errors.required');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return t('form.fields.email.errors.invalid');
        return '';
      case 'project_type':
        if (!value) return t('form.fields.projectType.errors.required');
        return '';
      case 'budget_range':
        if (!value) return t('form.fields.budgetRange.errors.required');
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
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });

    // Real-time validation
    if (fieldTouched[name]) {
      const error = validateField(name, value);
      setFieldErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFieldTouched(prev => ({ ...prev, [name]: true }));
    setFocusedField('');
    
    const error = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFocusedField(e.target.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const errors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'company') { // company is optional
        const error = validateField(key, formData[key as keyof typeof formData]);
        if (error) errors[key] = error;
      }
    });

    setFieldErrors(errors);
    setFieldTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // EmailJS configuration with actual API keys
      await emailjs.send(
        'service_k0o6pjb',        // Service ID
        'J2bpzRucK3c2SkZ8O',      // Template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          company: formData.company,
          project_type: formData.project_type,
          budget_range: formData.budget_range,
          phone: formData.phone,
          message: formData.message,
          to_name: 'Ahmed Zewar'
        },
        'vFeXiuswX_-hBd6vM12zz'  // Public Key
      );
      
      setSubmitStatus('success');
      setFormData({
        name: '', email: '', company: '', project_type: '', 
        budget_range: '', message: '', phone: ''
      });
    } catch {
      
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectTypes = [
    t('form.fields.projectType.options.0'),
    t('form.fields.projectType.options.1'),
    t('form.fields.projectType.options.2'),
    t('form.fields.projectType.options.3'),
    t('form.fields.projectType.options.4'),
    t('form.fields.projectType.options.5'),
    t('form.fields.projectType.options.6')
  ];

  const budgetRanges = [
    t('form.fields.budgetRange.options.0'),
    t('form.fields.budgetRange.options.1'),
    t('form.fields.budgetRange.options.2'),
    t('form.fields.budgetRange.options.3'),
    t('form.fields.budgetRange.options.4')
  ];

  return (
    <section id="contact" className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-b from-slate-900 to-purple-900/30">
      <div className="max-w-7xl mx-auto">

        {/* URGENCY HEADER */}
        <div className="text-center mb-12 sm:mb-14 md:mb-16">
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-red-600/20 backdrop-blur border border-red-400/30 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full animate-pulse"></div>
            <span className="text-red-300 font-bold text-xs sm:text-sm md:text-base">{t('urgency.badge')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 px-2 sm:px-0">
            {t.rich('title', {
              gradient: (chunks) => (
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  {chunks}
                </span>
              )
            })}
          </h2>

          <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-4 sm:mb-6 px-2 sm:px-0">
              {t('subtitle')}
            </p>

            {/* SOCIAL PROOF TICKER */}
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-8 text-xs sm:text-sm text-purple-300">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>{t('socialProof.0')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>{t('socialProof.1')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>{t('socialProof.2')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">

          {/* ENHANCED CONTACT FORM */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
              <h3 className="text-xl sm:text-2xl font-bold text-white">{t('form.title')}</h3>
              <div className="text-start sm:text-end">
                <div className="text-xs sm:text-sm text-purple-300">{t('form.pricing.regular')}</div>
                <div className="text-base sm:text-lg font-bold text-green-400">{t('form.pricing.offer')}</div>
              </div>
            </div>

            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-600/20 border border-green-500/30 rounded-lg">
                <h4 className="text-green-400 font-bold mb-2">{t('form.status.success.title')}</h4>
                <p className="text-green-300 text-sm">{t('form.status.success.message')}</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-600/20 border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-sm">{t('form.status.error.message')}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="relative">
                  <label htmlFor="name" className={`block text-sm font-medium transition-all duration-200 mb-2 ${
                    focusedField === 'name' || formData.name
                      ? 'text-purple-400'
                      : fieldErrors.name
                        ? 'text-red-400'
                        : 'text-gray-300'
                  }`}>
                    {t('form.fields.name.label')} {fieldErrors.name && '⚠️'}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required
                    className={`w-full px-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-all duration-200 focus-enhanced ${
                      fieldErrors.name
                        ? 'border-red-500 focus:border-red-400 animate-shake'
                        : focusedField === 'name'
                          ? 'border-purple-500 focus:border-purple-400 shadow-lg shadow-purple-500/20'
                          : 'border-slate-600 focus:border-purple-500'
                    }`}
                    placeholder={t('form.fields.name.placeholder')}
                  />
                  {fieldErrors.name && (
                    <div className="absolute -bottom-6 start-0 text-red-400 text-xs animate-slideInUp">
                      {fieldErrors.name}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <label htmlFor="email" className={`block text-sm font-medium transition-all duration-200 mb-2 ${
                    focusedField === 'email' || formData.email
                      ? 'text-purple-400'
                      : fieldErrors.email
                        ? 'text-red-400'
                        : 'text-gray-300'
                  }`}>
                    {t('form.fields.email.label')} {fieldErrors.email && '⚠️'}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required
                    className={`w-full px-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-all duration-200 focus-enhanced ${
                      fieldErrors.email
                        ? 'border-red-500 focus:border-red-400 animate-shake'
                        : focusedField === 'email'
                          ? 'border-purple-500 focus:border-purple-400 shadow-lg shadow-purple-500/20'
                          : 'border-slate-600 focus:border-purple-500'
                    }`}
                    placeholder={t('form.fields.email.placeholder')}
                  />
                  {fieldErrors.email && (
                    <div className="absolute -bottom-6 start-0 text-red-400 text-xs animate-slideInUp">
                      {fieldErrors.email}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="relative">
                  <label htmlFor="company" className={`block text-sm font-medium transition-all duration-200 mb-2 ${
                    focusedField === 'company' || formData.company
                      ? 'text-purple-400'
                      : 'text-gray-300'
                  }`}>
                    {t('form.fields.company.label')}
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-all duration-200 focus-enhanced ${
                      focusedField === 'company'
                        ? 'border-purple-500 focus:border-purple-400 shadow-lg shadow-purple-500/20'
                        : 'border-slate-600 focus:border-purple-500'
                    }`}
                    placeholder={t('form.fields.company.placeholder')}
                  />
                </div>
                <div className="relative">
                  <label htmlFor="phone" className={`block text-sm font-medium transition-all duration-200 mb-2 ${
                    focusedField === 'phone' || formData.phone
                      ? 'text-purple-400'
                      : fieldErrors.phone
                        ? 'text-red-400'
                        : 'text-gray-300'
                  }`}>
                    {t('form.fields.phone.label')} {fieldErrors.phone && '⚠️'}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-all duration-200 focus-enhanced ${
                      fieldErrors.phone
                        ? 'border-red-500 focus:border-red-400 animate-shake'
                        : focusedField === 'phone'
                          ? 'border-purple-500 focus:border-purple-400 shadow-lg shadow-purple-500/20'
                          : 'border-slate-600 focus:border-purple-500'
                    }`}
                    placeholder={t('form.fields.phone.placeholder')}
                  />
                  {fieldErrors.phone && (
                    <div className="absolute -bottom-6 start-0 text-red-400 text-xs animate-slideInUp">
                      {fieldErrors.phone}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative">
                  <label htmlFor="project_type" className={`block text-sm font-medium transition-all duration-200 mb-2 ${
                    focusedField === 'project_type' || formData.project_type
                      ? 'text-purple-400'
                      : fieldErrors.project_type
                        ? 'text-red-400'
                        : 'text-gray-300'
                  }`}>
                    {t('form.fields.projectType.label')} {fieldErrors.project_type && '⚠️'}
                  </label>
                  <select
                    id="project_type"
                    name="project_type"
                    value={formData.project_type}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required
                    className={`w-full px-4 py-3 bg-slate-900/50 border rounded-lg text-white focus:outline-none transition-all duration-200 focus-enhanced ${
                      fieldErrors.project_type
                        ? 'border-red-500 focus:border-red-400 animate-shake'
                        : focusedField === 'project_type'
                          ? 'border-purple-500 focus:border-purple-400 shadow-lg shadow-purple-500/20'
                          : 'border-slate-600 focus:border-purple-500'
                    }`}
                  >
                    <option value="">{t('form.fields.projectType.placeholder')}</option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {fieldErrors.project_type && (
                    <div className="absolute -bottom-6 start-0 text-red-400 text-xs animate-slideInUp">
                      {fieldErrors.project_type}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <label htmlFor="budget_range" className={`block text-sm font-medium transition-all duration-200 mb-2 ${
                    focusedField === 'budget_range' || formData.budget_range
                      ? 'text-purple-400'
                      : fieldErrors.budget_range
                        ? 'text-red-400'
                        : 'text-gray-300'
                  }`}>
                    {t('form.fields.budgetRange.label')} {fieldErrors.budget_range && '⚠️'}
                  </label>
                  <select
                    id="budget_range"
                    name="budget_range"
                    value={formData.budget_range}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required
                    className={`w-full px-4 py-3 bg-slate-900/50 border rounded-lg text-white focus:outline-none transition-all duration-200 focus-enhanced ${
                      fieldErrors.budget_range
                        ? 'border-red-500 focus:border-red-400 animate-shake'
                        : focusedField === 'budget_range'
                          ? 'border-purple-500 focus:border-purple-400 shadow-lg shadow-purple-500/20'
                          : 'border-slate-600 focus:border-purple-500'
                    }`}
                  >
                    <option value="">{t('form.fields.budgetRange.placeholder')}</option>
                    {budgetRanges.map((range) => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                  {fieldErrors.budget_range && (
                    <div className="absolute -bottom-6 start-0 text-red-400 text-xs animate-slideInUp">
                      {fieldErrors.budget_range}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="relative">
                <label htmlFor="message" className={`block text-sm font-medium transition-all duration-200 mb-2 ${
                  focusedField === 'message' || formData.message
                    ? 'text-purple-400'
                    : fieldErrors.message
                      ? 'text-red-400'
                      : 'text-gray-300'
                }`}>
                  {t('form.fields.message.label')} {fieldErrors.message && '⚠️'}
                </label>
                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required
                    rows={4}
                    className={`w-full px-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-all duration-200 resize-none focus-enhanced ${
                      fieldErrors.message
                        ? 'border-red-500 focus:border-red-400 animate-shake'
                        : focusedField === 'message'
                          ? 'border-purple-500 focus:border-purple-400 shadow-lg shadow-purple-500/20'
                          : 'border-slate-600 focus:border-purple-500'
                    }`}
                    placeholder={t('form.fields.message.placeholder')}
                  />
                  <div className="absolute bottom-2 end-2 text-xs text-gray-500">
                    {formData.message.length}/500
                  </div>
                </div>
                {fieldErrors.message && (
                  <div className="absolute -bottom-6 start-0 text-red-400 text-xs animate-slideInUp">
                    {fieldErrors.message}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold text-sm sm:text-base rounded-lg shadow-lg focus-enhanced disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] ${
                  submitStatus === 'success'
                    ? 'animate-successPulse bg-gradient-to-r from-green-600 to-green-700'
                    : isSubmitting
                      ? 'animate-pulse cursor-wait'
                      : 'btn-magnetic hover:shadow-purple-500/50'
                }`}
              >
                {submitStatus === 'success'
                  ? t('form.submit.success')
                  : isSubmitting
                    ? t('form.submit.loading')
                    : t('form.submit.idle')
                }
              </button>
            </form>
          </div>

          {/* CONTACT METHODS + TRUST SIGNALS */}
          <div className="space-y-6 sm:space-y-8">

            {/* INSTANT CONTACT */}
            <div className="bg-gradient-to-r from-green-600/20 to-green-800/20 backdrop-blur-md border border-green-500/30 rounded-xl p-4 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center">
                <span className="me-2 sm:me-3">💬</span>
                {t('whatsapp.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
                {t('whatsapp.description')}
              </p>
              <a
                href="https://wa.me/96560672773?text=Hi Ahmed, I'm interested in strategic digital marketing consultation for my business"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-sm sm:text-base rounded-lg transition-all duration-200 transform hover:scale-105 min-h-[44px]"
              >
                {t('whatsapp.button')}
              </a>
            </div>

            {/* TRUST SIGNALS */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-4 sm:p-6">
              <h4 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">{t('trustSignals.title')}</h4>
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">🏆</span>
                  <span>
                    {t.rich('trustSignals.items.0', {
                      strong: (chunks) => <strong className="font-bold text-white">{chunks}</strong>
                    })}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">💼</span>
                  <span>
                    {t.rich('trustSignals.items.1', {
                      strong: (chunks) => <strong className="font-bold text-white">{chunks}</strong>
                    })}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">🎯</span>
                  <span>
                    {t.rich('trustSignals.items.2', {
                      strong: (chunks) => <strong className="font-bold text-white">{chunks}</strong>
                    })}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">🌟</span>
                  <span>
                    {t.rich('trustSignals.items.3', {
                      strong: (chunks) => <strong className="font-bold text-white">{chunks}</strong>
                    })}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">🔒</span>
                  <span>
                    {t.rich('trustSignals.items.4', {
                      strong: (chunks) => <strong className="font-bold text-white">{chunks}</strong>
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* AVAILABILITY CALENDAR */}
            <div className="bg-purple-600/10 border border-purple-600/30 rounded-xl p-4 sm:p-6">
              <h4 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center">
                {t('availability.title')}
              </h4>
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-gray-300">{t('availability.slots.january.month')}</span>
                  <span className="text-red-400 font-bold">{t('availability.slots.january.status')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-gray-300">{t('availability.slots.february.month')}</span>
                  <span className="text-yellow-400 font-bold">{t('availability.slots.february.status')}</span>
                </div>
                <p className="text-purple-300 text-xs mt-4">
                  {t('availability.note')}
                </p>
              </div>
            </div>

            {/* CONTACT INFO */}
            <div className="space-y-3 sm:space-y-4">
              <h4 className="text-base sm:text-lg font-bold text-white">{t('contactMethods.title')}</h4>

              <div className="flex items-center gap-4 p-4 bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-lg">
                <span className="text-2xl">📧</span>
                <div>
                  <h5 className="text-sm font-medium text-gray-400">{t('contactMethods.email.label')}</h5>
                  <a href="mailto:ahmed@zewar.xyz" className="text-blue-400 hover:text-blue-300 transition-colors">
                    {t('contactMethods.email.value')}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-lg">
                <span className="text-2xl">💼</span>
                <div>
                  <h5 className="text-sm font-medium text-gray-400">{t('contactMethods.linkedin.label')}</h5>
                  <a
                    href="https://www.linkedin.com/in/ahmedziwar/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {t('contactMethods.linkedin.value')}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-lg">
                <span className="text-2xl">📍</span>
                <div>
                  <h5 className="text-sm font-medium text-gray-400">{t('contactMethods.location.label')}</h5>
                  <span className="text-white">{t('contactMethods.location.value')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* FINAL URGENCY CTA */}
        <div className="text-center mt-12 sm:mt-14 md:mt-16 p-6 sm:p-8 bg-gradient-to-r from-red-900/30 to-purple-900/30 backdrop-blur-md border border-red-500/30 rounded-2xl">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 px-2 sm:px-0">
            {t('finalCta.title')}
          </h3>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-4 sm:mb-6 max-w-3xl mx-auto px-2 sm:px-0">
            {t('finalCta.description')}
          </p>
          <div className="text-base sm:text-lg text-red-300 font-bold mb-3 sm:mb-4">
            {t('finalCta.urgency')}
          </div>
          <a
            href="#contact"
            className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-bold text-sm sm:text-base rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg min-h-[44px]"
          >
            {t('finalCta.button')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default EnhancedContact;