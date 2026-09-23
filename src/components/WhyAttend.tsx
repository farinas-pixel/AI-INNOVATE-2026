import React from 'react';
import { BookOpen, Hammer, Users, Lightbulb } from 'lucide-react';

export const WhyAttend: React.FC = () => {
  const pillars = [
    {
      title: 'Learn',
      description: 'Explore modern Artificial Intelligence concepts and applications.',
      icon: BookOpen,
      accent: 'border-blue-500/20 text-blue-400 bg-blue-600/10',
    },
    {
      title: 'Build',
      description: 'Understand how AI technologies can be applied to real-world problems.',
      icon: Hammer,
      accent: 'border-purple-500/20 text-purple-400 bg-purple-600/10',
    },
    {
      title: 'Connect',
      description: 'Interact with students and technology enthusiasts.',
      icon: Users,
      accent: 'border-cyan-500/20 text-cyan-400 bg-cyan-600/10',
    },
    {
      title: 'Innovate',
      description: 'Develop ideas and discover new possibilities using emerging technologies.',
      icon: Lightbulb,
      accent: 'border-indigo-500/20 text-indigo-400 bg-indigo-600/10',
    },
  ];

  return (
    <section id="why-attend" className="py-20 lg:py-28 relative bg-[#07111F] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16 text-left">
          <div className="text-xs sm:text-sm font-semibold text-purple-400 uppercase tracking-widest mb-3">
            Why Attend
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Designed for learners, builders, and innovators.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            AI INNOVATE 2026 offers a focused setting to broaden your technical perspectives,
            explore emerging toolsets, and meet other curious minds.
          </p>
        </div>

        {/* Four Clean, Restrained Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="p-8 rounded-2xl bg-[#0B172A] border border-white/10 hover:border-white/20 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-6 ${pillar.accent}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{pillar.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{pillar.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
