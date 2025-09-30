import React from 'react';

const About: React.FC = () => {
  const stats = [
    { label: "Years Experience", value: "20+" },
    { label: "Projects Completed", value: "150+" },
    { label: "Happy Clients", value: "50+" },
    { label: "ROI Generated", value: "300%" }
  ];

  const skills = [
    "Digital Marketing Strategy",
    "E-commerce Management",
    "Social Media Marketing",
    "SEO/SEM Optimization",
    "PPC Campaign Management",
    "Content Marketing",
    "Email Marketing",
    "Analytics & Reporting",
    "IT Consulting",
    "Business Development"
  ];

  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-14 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            About Me
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-blue-500 mx-auto"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Description - Full Width */}
          <div className="space-y-4 sm:space-y-6 text-center">
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed px-2 sm:px-0">
              With over 20 years of experience in digital marketing and IT consulting,
              I help businesses transform their online presence and achieve measurable growth.
              My expertise spans from strategic planning to hands-on implementation of
              ROI-driven digital campaigns.
            </p>

            <p className="text-base sm:text-lg text-gray-300 leading-relaxed px-2 sm:px-0">
              Currently serving as Digital Solutions Manager at Smart Technology (STSCKW)
              in Kuwait, I specialize in e-commerce optimization, digital marketing strategy,
              and business process improvement. My approach combines technical expertise
              with creative problem-solving to deliver exceptional results.
            </p>

            {/* Skills Grid */}
            <div className="pt-4 sm:pt-6">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Core Competencies</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600/10 border border-blue-600/30 rounded-full text-blue-400 text-xs sm:text-sm hover:bg-blue-600/20 transition-colors duration-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Grid - Centered */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto mt-8 sm:mt-10 md:mt-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 sm:p-5 md:p-6 text-center hover:bg-slate-800/70 transition-colors duration-200"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-400 mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Timeline Preview */}
        <div className="mt-12 sm:mt-14 md:mt-16 bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-lg p-4 sm:p-6 md:p-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">Recent Experience</h3>
          <div className="space-y-4 sm:space-y-5">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <div className="flex-1">
                <h4 className="text-base sm:text-lg font-semibold text-white">Digital Solutions Manager</h4>
                <p className="text-sm sm:text-base text-blue-400">Smart Technology (STSCKW) • 2022 - Present</p>
                <p className="text-sm text-gray-400 mt-1">Leading digital transformation initiatives and e-commerce strategies</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <div className="flex-1">
                <h4 className="text-base sm:text-lg font-semibold text-white">Digital Marketing Manager</h4>
                <p className="text-sm sm:text-base text-blue-400">Dr Scent • 2023 - 2024</p>
                <p className="text-sm text-gray-400 mt-1">Implemented comprehensive digital marketing strategies</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <div className="flex-1">
                <h4 className="text-base sm:text-lg font-semibold text-white">Social Media Specialist</h4>
                <p className="text-sm sm:text-base text-blue-400">Ooredoo Kuwait • 2019 - 2022</p>
                <p className="text-sm text-gray-400 mt-1">Built and executed social media strategies for major telecom brand</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;