import React from 'react';

interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah K.',
    role: 'E-commerce Entrepreneur',
    quote:
      'Ahmed transformed our online store and tripled our conversion rate. His strategies simply work.',
  },
  {
    name: 'David M.',
    role: 'Marketing Director',
    quote:
      'The SEO and analytics insights Ahmed provided were game changers for our lead generation efforts.',
  },
  {
    name: 'Lina R.',
    role: 'Small Business Owner',
    quote:
      'Thanks to Ahmed\'s social media campaigns, our brand engagement has skyrocketed.',
  },
];

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-12 sm:py-16 md:py-20 px-4 bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Testimonials</h2>
          <div className="w-20 sm:w-24 h-1 bg-blue-500 mx-auto mb-6 sm:mb-8" />
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-2 sm:px-0">
            Hear from clients who have partnered with Ahmed Zewar to elevate their digital presence.
          </p>
        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 sm:p-5 md:p-6 text-center"
            >
              <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4 italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <h3 className="text-base sm:text-lg font-semibold text-white">{t.name}</h3>
              <p className="text-xs sm:text-sm text-gray-400">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;