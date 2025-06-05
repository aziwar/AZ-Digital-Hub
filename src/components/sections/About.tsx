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
    <section id="about" className="py-20 px-4">
      <div className="max-w-7xl mx-auto @container">
        <div className="text-center mb-16">
          <h2 className="text-4xl @md:text-5xl font-bold text-white mb-4">
            About Me
          </h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto"></div>
        </div>

        <div className="grid @lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Description */}
          <div className="space-y-6">
            <p className="text-lg text-gray-300 leading-relaxed">
              With over 20 years of experience in digital marketing and IT consulting, 
              I help businesses transform their online presence and achieve measurable growth. 
              My expertise spans from strategic planning to hands-on implementation of 
              ROI-driven digital campaigns.
            </p>
            
            <p className="text-lg text-gray-300 leading-relaxed">
              Currently serving as Digital Solutions Manager at Smart Technology (STSCKW) 
              in Kuwait, I specialize in e-commerce optimization, digital marketing strategy, 
              and business process improvement. My approach combines technical expertise 
              with creative problem-solving to deliver exceptional results.
            </p>

            {/* Skills Grid */}
            <div className="pt-6">
              <h3 className="text-xl font-semibold text-white mb-4">Core Competencies</h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-600/10 border border-blue-600/30 rounded-full text-blue-400 text-sm hover:bg-blue-600/20 transition-colors duration-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 text-center hover:bg-slate-800/70 transition-colors duration-200"
              >
                <div className="text-3xl @md:text-4xl font-bold text-blue-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Timeline Preview */}
        <div className="mt-16 bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-lg p-8">
          <h3 className="text-2xl font-semibold text-white mb-6">Recent Experience</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5"></div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white">Digital Solutions Manager</h4>
                <p className="text-blue-400">Smart Technology (STSCKW) • 2022 - Present</p>
                <p className="text-gray-400 mt-1">Leading digital transformation initiatives and e-commerce strategies</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5"></div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white">Digital Marketing Manager</h4>
                <p className="text-blue-400">Dr Scent • 2023 - 2024</p>
                <p className="text-gray-400 mt-1">Implemented comprehensive digital marketing strategies</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5"></div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white">Social Media Specialist</h4>
                <p className="text-blue-400">Ooredoo Kuwait • 2019 - 2022</p>
                <p className="text-gray-400 mt-1">Built and executed social media strategies for major telecom brand</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;