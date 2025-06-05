// src/components/sections/Hero.tsx
import React from 'react';
import Link from 'next/link';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
      
      <div className="relative z-10 container max-w-7xl mx-auto p-4 @container">
        {/* Main Content */}
        <div className="space-y-8">
          {/* Title */}
          <h1 className="text-5xl @md:text-7xl font-bold text-white tracking-tight">
            Ahmed Ziwar
          </h1>
          
          {/* Subtitle */}
          <div className="space-y-2">
            <h2 className="text-2xl @md:text-4xl font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Digital Marketing Manager
            </h2>
            <p className="text-lg @md:text-xl text-gray-300 max-w-2xl mx-auto">
              Strategic Thinker | Creative Problem Solver | ROI-Driven
            </p>
          </div>
          
          {/* Experience Badge */}
          <div className="flex justify-center">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3">
              <p className="text-white font-medium">
                20+ Years of Experience in Digital Excellence
              </p>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col @sm:flex-row gap-4 justify-center mt-10">
            <Link
              href="#portfolio"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/50"
            >
              View My Work
            </Link>
            <Link
              href="#contact"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold rounded-lg border border-white/20 transition-all duration-200 transform hover:scale-105"
            >
              Get In Touch
            </Link>
          </div>
          
          {/* Social Links */}
          <div className="flex justify-center gap-6 mt-8">
            <a
              href="https://www.linkedin.com/in/ahmedziwar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a
              href="mailto:ahmedziwar@gmail.com"
              className="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Email"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
            <a
              href="tel:+96560672773"
              className="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Phone"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;