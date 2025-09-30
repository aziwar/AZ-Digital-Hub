import React from 'react';

const Portfolio: React.FC = () => {
  const projects = [
    {
      title: "E-commerce Platform Optimization",
      client: "Smart Technology (STSCKW)",
      description: "Led the complete overhaul of e-commerce platform resulting in 200% increase in conversion rates",
      tags: ["E-commerce", "SEO", "UX Optimization"],
      results: ["200% conversion increase", "150% ROI improvement", "50% faster load times"]
    },
    {
      title: "Digital Marketing Campaign",
      client: "Dr Scent",
      description: "Developed and executed comprehensive digital marketing strategy across multiple channels",
      tags: ["Social Media", "PPC", "Email Marketing"],
      results: ["300% social engagement", "250% lead generation", "180% sales growth"]
    },
    {
      title: "Social Media Transformation",
      client: "Ooredoo Kuwait",
      description: "Built social media presence from ground up for major telecommunications provider",
      tags: ["Social Strategy", "Content Creation", "Community Management"],
      results: ["500K+ followers", "400% engagement rate", "Top telecom brand on social"]
    },
    {
      title: "IT Infrastructure Modernization",
      client: "Multiple Clients",
      description: "Consulted on digital transformation projects for various businesses in Kuwait",
      tags: ["IT Consulting", "System Design", "Implementation"],
      results: ["60% cost reduction", "99.9% uptime", "Streamlined operations"]
    }
  ];

  return (
    <section id="portfolio" className="py-12 sm:py-16 md:py-20 px-4 bg-slate-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-14 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Portfolio
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-blue-500 mx-auto mb-6 sm:mb-8"></div>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-2 sm:px-0">
            Showcasing successful projects and measurable results
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg overflow-hidden hover:border-blue-600/50 transition-all duration-300 group"
            >
              <div className="p-4 sm:p-6 md:p-8">
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm sm:text-base text-blue-400 mb-3 sm:mb-4">{project.client}</p>
                <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 sm:px-3 py-1 bg-slate-700/50 text-xs sm:text-sm text-gray-300 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Results */}
                <div className="border-t border-slate-700 pt-4 sm:pt-6">
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-400 mb-2 sm:mb-3">KEY RESULTS</h4>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {project.results.map((result, idx) => (
                      <li key={idx} className="flex items-start text-xs sm:text-sm text-green-400">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5 9.293 8.207a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 000-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="flex-1">{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Case Studies CTA */}
        <div className="mt-8 sm:mt-10 md:mt-12 text-center">
          <p className="text-base sm:text-lg text-gray-300 mb-4 sm:mb-6 px-2 sm:px-0">
            Want to see more detailed case studies?
          </p>
          <a
            href="#contact"
            className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base rounded-lg transition-all duration-200 transform hover:scale-105 min-h-[44px]"
          >
            Request Case Studies
          </a>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;