// ENHANCED Hero - Maximum Customer Conversion Focus with Visual Enhancements
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { ROIChart } from '@/components/ui/ROIChart';
import { ServiceIconGrid } from '@/components/ui/ServiceIcons';
import { imageConfig } from '@/lib/images.config';

const EnhancedHero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden">
      
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Content - Left Side */}
          <div className="lg:col-span-7 text-center lg:text-left">
            
            {/* URGENT AVAILABILITY ALERT */}
            <div className="mb-6 sm:mb-8 inline-flex items-center space-x-2 sm:space-x-3 bg-red-600/20 backdrop-blur border border-red-400/50 rounded-full px-4 sm:px-6 py-2 sm:py-3 animate-bounce">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-red-300 font-bold text-xs sm:text-sm md:text-base">🔥 URGENT: Only 3 Slots Left</span>
            </div>

            {/* Commanding Headlines */}
            <h1 className="hero-title text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight mb-4 sm:mb-6 text-animate-reveal">
              <span className="block" style={{ "--animation-delay": "0.2s" } as React.CSSProperties}>Ahmed Zewar</span>
              <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent text-hover-glow" style={{ "--animation-delay": "0.4s" } as React.CSSProperties}>
                Commands Results
              </span>
            </h1>
            
            {/* VALUE PROPOSITION */}
            <div className="mb-6 sm:mb-8 text-animate-reveal" style={{ "--animation-delay": "0.6s" } as React.CSSProperties}>
              <h2 className="hero-subtitle text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-200 mb-3 sm:mb-4 text-hover-glow">
                Kuwait&apos;s #1 Digital Marketing Strategist
              </h2>
              <p className="hero-description text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed px-2 sm:px-0">
                Transform your business with <span className="text-purple-400 font-bold">proven strategies</span> that generated
                <span className="text-green-400 font-bold"> 300% ROI</span> for 200+ Kuwait companies
              </p>
            </div>

            {/* Service Icons Grid */}
            <div className="mb-8">
              <ServiceIconGrid />
            </div>

            {/* PRIMARY CTAs */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start text-animate-reveal" style={{ "--animation-delay": "0.8s" } as React.CSSProperties}>
              <Link
                href="#contact"
                className="group btn-primary btn-magnetic btn-pulse text-base sm:text-lg min-h-[44px] focus-enhanced"
              >
                <span className="flex items-center justify-center">
                  🚀 Book FREE Strategic Session
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </span>
                <div className="text-xs sm:text-sm font-normal opacity-90 mt-1">Usually 2,000 KWD - Limited Time</div>
              </Link>

              <a
                href="https://wa.me/96560672773?text=Hi Ahmed, I need urgent strategic consultation for my business"
                target="_blank"
                rel="noopener noreferrer"
                className="group btn-whatsapp btn-magnetic text-base sm:text-lg min-h-[44px] focus-enhanced"
              >
                <span className="flex items-center justify-center">
                  💬 WhatsApp Instant Response
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </span>
                <div className="text-xs sm:text-sm font-normal opacity-90 mt-1">+965 6067 2773</div>
              </a>
            </div>

            {/* SOCIAL PROOF TICKER */}
            <div className="mb-8 flex flex-wrap justify-center lg:justify-start items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center space-x-2 bg-green-600/20 rounded-full px-4 py-2">
                <span className="text-green-400">✓</span>
                <span className="text-green-300">200+ Kuwait Businesses</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-600/20 rounded-full px-4 py-2">
                <span className="text-blue-400">✓</span>
                <span className="text-blue-300">20+ Years Expertise</span>
              </div>
              <div className="flex items-center space-x-2 bg-purple-600/20 rounded-full px-4 py-2">
                <span className="text-purple-400">✓</span>
                <span className="text-purple-300">ENTJ Leadership</span>
              </div>
            </div>
          </div>

          {/* Right Side - ROI Chart & Professional Image */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Professional Image */}
            <div className="relative mx-auto w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
              {/* Neon Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-full blur-2xl animate-pulse" />
              
              {/* Image Container */}
              <div className="relative w-full h-full">
                <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 rounded-full border-4 border-purple-400/50 overflow-hidden">
                  <Image
                    src={imageConfig.profile.profileImage}
                    alt="Ahmed Zewar - Digital Marketing Expert"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* ROI Chart */}
            <div className="max-w-md mx-auto">
              <ROIChart />
            </div>
          </div>
        </div>

        {/* RESULTS METRICS - Full Width */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md border border-purple-400/30 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 text-center">
            <div className="text-4xl font-bold text-white mb-2">300%</div>
            <div className="text-purple-300 font-medium">Average ROI Increase</div>
            <div className="text-xs text-gray-400 mt-1">Within 6 months</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-cyan-400/30 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 text-center">
            <div className="text-4xl font-bold text-white mb-2">150%</div>
            <div className="text-cyan-300 font-medium">Conversion Rate Boost</div>
            <div className="text-xs text-gray-400 mt-1">E-commerce clients</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-green-400/30 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 text-center">
            <div className="text-4xl font-bold text-white mb-2">24-48h</div>
            <div className="text-green-300 font-medium">Response Time</div>
            <div className="text-xs text-gray-400 mt-1">Guaranteed</div>
          </div>
        </div>

        {/* GUARANTEES & RISK REVERSAL */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 backdrop-blur-md border border-green-500/30 rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">
              🛡️ 100% Risk-Free Guarantee
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-start space-x-3 mb-2">
                <span className="text-green-400 mt-1 flex-shrink-0">✓</span>
                <span className="text-gray-300 leading-relaxed">Money-back if no results in 90 days</span>
              </div>
              <div className="flex items-start space-x-3 mb-2">
                <span className="text-green-400 mt-1 flex-shrink-0">✓</span>
                <span className="text-gray-300 leading-relaxed">Free strategy audit included</span>
              </div>
              <div className="flex items-start space-x-3 mb-2">
                <span className="text-green-400 mt-1 flex-shrink-0">✓</span>
                <span className="text-gray-300 leading-relaxed">Cancel anytime, no questions asked</span>
              </div>
            </div>
          </div>
        </div>

        {/* SCROLL INDICATOR */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center space-y-2 animate-bounce">
            <span className="text-purple-400 text-sm font-medium">See Success Stories</span>
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHero;