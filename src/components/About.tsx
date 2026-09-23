import React from 'react';
import { Cpu, Terminal, Users, Sparkles, BookOpen } from 'lucide-react';
import { About3DObject } from './About3DObject.tsx';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-20 lg:py-28 relative border-t border-white/5 bg-[#07111F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 text-left">
          <div className="text-xs sm:text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-3">
            About The Event
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            A student symposium dedicated to artificial intelligence.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            AI INNOVATE 2026 brings together students, researchers, and technology enthusiasts
            to explore the practical concepts and future directions of Artificial Intelligence.
            Hosted at the Innovation Auditorium, this one-day symposium features technical sessions,
            hands-on discussions, and student project demonstrations.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Bento Item 1: Wide Card (Span 2) with Floating 3D Geometric Object */}
          <div className="md:col-span-2 p-8 rounded-2xl bg-[#0B172A] border border-white/10 hover:border-blue-500/30 transition-all duration-200 relative overflow-hidden flex flex-col justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              <div className="sm:col-span-8">
                <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-400 mb-6">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Core Technical Foundations & Emerging AI
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                  Gain a grounded understanding of modern machine learning workflows, foundation model
                  architectures, and real-world system implementations. Sessions emphasize practical
                  application over superficial hype.
                </p>
              </div>

              {/* 3D Floating Polyhedron */}
              <div className="sm:col-span-4 flex items-center justify-center">
                <About3DObject />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-4 border-t border-white/5">
              <span>Foundation Models</span>
              <span aria-hidden="true">·</span>
              <span>Generative Techniques</span>
              <span aria-hidden="true">·</span>
              <span>Autonomous Systems</span>
            </div>
          </div>

          {/* Bento Item 2: Interactive Sessions */}
          <div className="p-8 rounded-2xl bg-[#0B172A] border border-white/10 hover:border-purple-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-600/15 border border-purple-500/25 flex items-center justify-center text-purple-400 mb-6">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Interactive Demonstrations
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Explore step-by-step technical walkthroughs covering intelligent agents, vision
              models, and edge computing setups.
            </p>
            <span className="text-xs font-medium text-purple-400">
              Live Walkthroughs & Code
            </span>
          </div>

          {/* Bento Item 3: Student Project Showcase */}
          <div className="p-8 rounded-2xl bg-[#0B172A] border border-white/10 hover:border-cyan-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-cyan-600/15 border border-cyan-500/25 flex items-center justify-center text-cyan-400 mb-6">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Student Project Showcase
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Discover student-led initiatives across computer vision, natural language processing,
              and robotics in an open exhibition format.
            </p>
            <span className="text-xs font-medium text-cyan-400">
              Peer Innovation & Ideas
            </span>
          </div>

          {/* Bento Item 4: Community & Networking (Span 2) */}
          <div className="md:col-span-2 p-8 rounded-2xl bg-[#0B172A] border border-white/10 hover:border-indigo-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400 mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Collaborative Student & Academic Community
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Connect with fellow engineering students, faculty advisors, and technology enthusiasts
              who are actively exploring artificial intelligence and shaping student technical clubs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
