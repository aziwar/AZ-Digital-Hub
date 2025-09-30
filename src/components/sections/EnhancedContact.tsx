'use client';

import emailjs from '@emailjs/browser';
import React, { useState } from 'react';

const EnhancedContact: React.FC = () => {
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
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
      case 'project_type':
        if (!value) return 'Please select a project type';
        return '';
      case 'budget_range':
        if (!value) return 'Please select a budget range';
        return '';
      case 'message':
        if (!value.trim()) return 'Please describe your strategic objectives';
        if (value.trim().length < 20) return 'Please provide more details (minimum 20 characters)';
        return '';
      case 'phone':
        if (value && !/^\+?[1-9]\d{1,14}$/.test(value.replace(/\s/g, ''))) {
          return 'Please enter a valid phone number';
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
    'E-commerce Development',
    'Digital Marketing Campaign',
    'Website Redesign',
    'SEO Optimization',
    'Social Media Strategy',
    'IT Consulting',
    'Other'
  ];

  const budgetRanges = [
    'Under 5,000 KWD',
    '5,000 - 15,000 KWD',
    '15,000 - 50,000 KWD',
    '50,000+ KWD',
    'Enterprise (Custom Quote)'
  ];

  return (
    <section id="contact" className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-b from-slate-900 to-purple-900/30">
      <div className="max-w-7xl mx-auto">

        {/* URGENCY HEADER */}
        <div className="text-center mb-12 sm:mb-14 md:mb-16">
          <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-red-600/20 backdrop-blur border border-red-400/30 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full animate-pulse"></div>
            <span className="text-red-300 font-bold text-xs sm:text-sm md:text-base">⚡ Only 3 Strategic Slots Available</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 px-2 sm:px-0">
            Ready to <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Command</span> Your Market?
          </h2>

          <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-4 sm:mb-6 px-2 sm:px-0">
              Join 200+ Kuwait businesses that transformed their digital presence with strategic leadership
            </p>

            {/* SOCIAL PROOF TICKER */}
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-8 text-xs sm:text-sm text-purple-300">
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>24-48h response</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Free audit</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>ROI guarantee</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">

          {/* ENHANCED CONTACT FORM */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Start Your Strategic Session</h3>
              <div className="text-left sm:text-right">
                <div className="text-xs sm:text-sm text-purple-300">Usually $2,000 KWD</div>
                <div className="text-base sm:text-lg font-bold text-green-400">FREE Audit</div>
              </div>
            </div>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-600/20 border border-green-500/30 rounded-lg">
                <h4 className="text-green-400 font-bold mb-2">🎯 Strategic Session Booked!</h4>
                <p className="text-green-300 text-sm">Ahmed will personally contact you within 24 hours with your free strategic audit results.</p>
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-600/20 border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-sm">Failed to submit. Please try WhatsApp contact below or email directly.</p>
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
                    Your Name * {fieldErrors.name && '⚠️'}
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
                    placeholder="Ahmed Al-Rashid"
                  />
                  {fieldErrors.name && (
                    <div className="absolute -bottom-6 left-0 text-red-400 text-xs animate-slideInUp">
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
                    Business Email * {fieldErrors.email && '⚠️'}
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
                    placeholder="ahmed@company.com"
                  />
                  {fieldErrors.email && (
                    <div className="absolute -bottom-6 left-0 text-red-400 text-xs animate-slideInUp">
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
                    Company/Organization
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
                    placeholder="Al-Rashid Trading Co."
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
                    WhatsApp Number {fieldErrors.phone && '⚠️'}
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
                    placeholder="+965 XXXX XXXX"
                  />
                  {fieldErrors.phone && (
                    <div className="absolute -bottom-6 left-0 text-red-400 text-xs animate-slideInUp">
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
                    Project Type * {fieldErrors.project_type && '⚠️'}
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
                    <option value="">Select Project Type</option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {fieldErrors.project_type && (
                    <div className="absolute -bottom-6 left-0 text-red-400 text-xs animate-slideInUp">
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
                    Investment Range * {fieldErrors.budget_range && '⚠️'}
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
                    <option value="">Select Budget Range</option>
                    {budgetRanges.map((range) => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                  {fieldErrors.budget_range && (
                    <div className="absolute -bottom-6 left-0 text-red-400 text-xs animate-slideInUp">
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
                  Strategic Objectives * {fieldErrors.message && '⚠️'}
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
                    placeholder="Describe your current challenges and business goals..."
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                    {formData.message.length}/500
                  </div>
                </div>
                {fieldErrors.message && (
                  <div className="absolute -bottom-6 left-0 text-red-400 text-xs animate-slideInUp">
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
                  ? '✅ Strategic Session Booked!'
                  : isSubmitting
                    ? '⚡ Booking Your Strategic Session...'
                    : '🚀 Book FREE Strategic Session (Worth 2,000 KWD)'
                }
              </button>
            </form>
          </div>

          {/* CONTACT METHODS + TRUST SIGNALS */}
          <div className="space-y-6 sm:space-y-8">

            {/* INSTANT CONTACT */}
            <div className="bg-gradient-to-r from-green-600/20 to-green-800/20 backdrop-blur-md border border-green-500/30 rounded-xl p-4 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center">
                <span className="mr-2 sm:mr-3">💬</span>
                Instant Response Available
              </h3>
              <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
                For urgent projects or immediate consultation, contact Ahmed directly via WhatsApp.
              </p>
              <a
                href="https://wa.me/96560672773?text=Hi Ahmed, I'm interested in strategic digital marketing consultation for my business"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-sm sm:text-base rounded-lg transition-all duration-200 transform hover:scale-105 min-h-[44px]"
              >
                <span className="mr-2">📱</span>
                WhatsApp: +965 6067 2773
              </a>
            </div>

            {/* TRUST SIGNALS */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-4 sm:p-6">
              <h4 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">✅ Why Kuwait Businesses Choose Ahmed</h4>
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-300">
                <div className="flex items-start space-x-3">
                  <span className="text-green-400 mt-1">🏆</span>
                  <span><strong>20+ Years</strong> of proven digital marketing excellence in Kuwait & GCC</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-400 mt-1">💼</span>
                  <span><strong>200+ Local Businesses</strong> transformed and scaled successfully</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-400 mt-1">🎯</span>
                  <span><strong>300% Average ROI</strong> improvement within first 6 months</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-400 mt-1">🌟</span>
                  <span><strong>ENTJ Leadership Style</strong> - Strategic, decisive, results-driven</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-400 mt-1">🔒</span>
                  <span><strong>100% Money-Back Guarantee</strong> if no measurable results in 90 days</span>
                </div>
              </div>
            </div>

            {/* AVAILABILITY CALENDAR */}
            <div className="bg-purple-600/10 border border-purple-600/30 rounded-xl p-4 sm:p-6">
              <h4 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center">
                <span className="mr-2">⏰</span>
                Limited Strategic Sessions
              </h4>
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-gray-300">January 2025</span>
                  <span className="text-red-400 font-bold">3 slots remaining</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-gray-300">February 2025</span>
                  <span className="text-yellow-400 font-bold">Waitlist only</span>
                </div>
                <p className="text-purple-300 text-xs mt-4">
                  ⚡ High demand due to Ramadan preparation projects. Book now to secure your strategic consultation.
                </p>
              </div>
            </div>

            {/* CONTACT INFO */}
            <div className="space-y-3 sm:space-y-4">
              <h4 className="text-base sm:text-lg font-bold text-white">Other Contact Methods</h4>
              
              <div className="flex items-center space-x-4 p-4 bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-lg">
                <span className="text-2xl">📧</span>
                <div>
                  <h5 className="text-sm font-medium text-gray-400">Email</h5>
                  <a href="mailto:ahmed@zewar.xyz" className="text-blue-400 hover:text-blue-300 transition-colors">
                    ahmed@zewar.xyz
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-lg">
                <span className="text-2xl">💼</span>
                <div>
                  <h5 className="text-sm font-medium text-gray-400">LinkedIn</h5>
                  <a 
                    href="https://www.linkedin.com/in/ahmedziwar/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    linkedin.com/in/ahmedziwar
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-lg">
                <span className="text-2xl">📍</span>
                <div>
                  <h5 className="text-sm font-medium text-gray-400">Location</h5>
                  <span className="text-white">Kuwait City, Kuwait</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* FINAL URGENCY CTA */}
        <div className="text-center mt-12 sm:mt-14 md:mt-16 p-6 sm:p-8 bg-gradient-to-r from-red-900/30 to-purple-900/30 backdrop-blur-md border border-red-500/30 rounded-2xl">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 px-2 sm:px-0">
            ⚡ Don&apos;t Miss Your Strategic Advantage
          </h3>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-4 sm:mb-6 max-w-3xl mx-auto px-2 sm:px-0">
            While your competitors struggle with outdated marketing, secure your spot for strategic digital transformation that delivers results.
          </p>
          <div className="text-base sm:text-lg text-red-300 font-bold mb-3 sm:mb-4">
            ⏰ Only 3 consultation slots remaining this month
          </div>
          <a
            href="#contact"
            className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-bold text-sm sm:text-base rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg min-h-[44px]"
          >
            Secure My Strategic Session Now →
          </a>
        </div>
      </div>
    </section>
  );
};

export default EnhancedContact;