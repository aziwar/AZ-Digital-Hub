'use client'

// ENTJ Commander Services - Strategic Leadership Solutions
import React from 'react';

import { useScrollObserver } from '@/hooks/useScrollObserver';

const Services: React.FC = () => {
  const { elementRef: sectionRef, isVisible: sectionVisible } = useScrollObserver({ threshold: 0.2 })
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollObserver({ threshold: 0.3 })
  const { elementRef: ctaRef, isVisible: ctaVisible } = useScrollObserver({ threshold: 0.4 })

  const services = [
    {
      icon: "⚡",
      title: "Strategic Digital Transformation",
      description: "End-to-end digital strategy that delivers measurable ROI. From vision to execution, I orchestrate complete business transformation.",
      results: "300% avg revenue increase",
      features: ["Executive Strategy Sessions", "Digital Roadmap Creation", "KPI Framework Design", "Performance Optimization"]
    },
    {
      icon: "🎯",
      title: "E-commerce Command & Control",
      description: "Complete e-commerce ecosystem management. Platform optimization, funnel engineering, and conversion maximization for sustained growth.",
      results: "150% conversion improvement",
      features: ["Platform Architecture", "KNET Payment Integration", "Conversion Rate Optimization", "Sales Performance Analytics"]
    },
    {
      icon: "🚀",
      title: "Kuwait Market Leadership",
      description: "Dominate the GCC digital landscape with culturally-aware campaigns that resonate with local markets while driving international reach.",
      results: "GCC market penetration",
      features: ["Arabic/English Campaigns", "Ramadan Strategy Planning", "Local SEO Mastery", "Regional Social Influence"]
    },
    {
      icon: "💼",
      title: "Enterprise IT Consulting",
      description: "Technology transformation that aligns with business objectives. Strategic IT solutions that enhance operational efficiency and competitive advantage.",
      results: "40% efficiency gains",
      features: ["Infrastructure Assessment", "Digital Process Optimization", "Team Training & Development", "Technology Stack Modernization"]
    },
    {
      icon: "📊",
      title: "Data-Driven Decision Making",
      description: "Transform raw data into strategic insights. Advanced analytics frameworks that drive informed decisions and sustainable competitive advantage.",
      results: "Real-time intelligence",
      features: ["Performance Dashboard Creation", "ROI Tracking Systems", "Predictive Analytics", "Strategic Reporting Automation"]
    },
    {
      icon: "⭐",
      title: "Executive Leadership Coaching",
      description: "Develop your team's strategic thinking capabilities. Leadership development focused on results-driven execution and organizational excellence.",
      results: "Team performance boost",
      features: ["Leadership Strategy Sessions", "Process Optimization Training", "Goal Achievement Systems", "Performance Management"]
    }
  ];

  return (
    <>
      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-4xl" />
      
      <section
        id="services"
        ref={sectionRef as React.RefObject<HTMLElement>}
        className={`py-12 sm:py-16 md:py-20 lg:py-24 px-4 bg-gradient-to-b from-slate-900 to-purple-900/20 transition-all duration-1000 ${
          sectionVisible ? 'observe-fade-in is-visible' : 'observe-fade-in'
        }`}
      >
      <div className="max-w-7xl mx-auto">
        
        {/* Commander Leadership Header */}
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-12 sm:mb-16 md:mb-20 transition-all duration-800 ${
            headerVisible ? 'observe-slide-left is-visible' : 'observe-slide-left'
          }`}
        >
          <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-purple-600/20 backdrop-blur border border-purple-400/30 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6 animate-fade-in-up">
            <span className="text-purple-300 font-bold text-xs sm:text-sm md:text-base">Strategic Solutions • Proven Results</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 text-animate-reveal text-hover-glow px-2 sm:px-0">
            Command Excellence
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed text-animate-reveal px-4 sm:px-0" style={{ "--animation-delay": "0.2s" } as React.CSSProperties}>
            Strategic digital leadership that transforms vision into measurable results.
            <span className="text-purple-400 font-semibold"> No compromise on performance.</span>
          </p>
        </div>

        {/* Strategic Services Grid */}
        <div className={`grid sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-14 md:mb-16 transition-all duration-1000 ${
          sectionVisible ? 'observe-stagger-children is-visible' : 'observe-stagger-children'
        }`}>
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 sm:p-6 md:p-8 hover:bg-slate-800/60 hover:border-purple-500/50 transition-all duration-300 group animate-stagger btn-enhanced"
              style={{ "--stagger-delay": `${index * 0.1}s` } as React.CSSProperties}
            >
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="text-3xl sm:text-4xl flex-shrink-0 service-icon">{service.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 group-hover:text-purple-400 transition-colors service-title">
                    {service.title}
                  </h3>
                  <div className="mb-3 sm:mb-4">
                    <div className="inline-flex items-center bg-purple-600/20 rounded-full px-2.5 sm:px-3 py-1 mb-2 sm:mb-3">
                      <span className="text-purple-300 text-xs sm:text-sm font-semibold">{service.results}</span>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base md:text-lg leading-relaxed service-description">
                    {service.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 services-features-grid">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start text-xs sm:text-sm text-gray-300 service-feature-text">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full mr-2 sm:mr-3 mt-1 flex-shrink-0 feature-bullet"></div>
                        <span className="flex-1">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Commander CTA */}
        <div
          ref={ctaRef as React.RefObject<HTMLDivElement>}
          className={`text-center bg-gradient-to-r from-purple-900/50 to-slate-900/50 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 transition-all duration-800 ${
            ctaVisible ? 'observe-slide-right is-visible' : 'observe-slide-right'
          }`}
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 px-2 sm:px-0">
            Ready to Command Your Market?
          </h3>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-2 sm:px-0">
            Strategic consultation sessions that deliver immediate clarity and actionable plans for market dominance.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href="#contact"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm sm:text-base rounded-lg shadow-lg hover:shadow-purple-500/50 btn-magnetic focus-enhanced min-h-[44px]"
            >
              Strategic Consultation →
            </a>
            <a
              href="#portfolio"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-sm sm:text-base rounded-lg border border-purple-400/30 btn-magnetic focus-enhanced min-h-[44px]"
            >
              View Success Stories
            </a>
          </div>
        </div>
      </div>
      </section>
    </>
  );
};

export default Services;