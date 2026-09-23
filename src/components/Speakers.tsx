import React from 'react';
import { Clock, BookOpen, Layers } from 'lucide-react';

interface RoleSpeaker {
  id: string;
  field: string;
  role: string;
  monogram: string;
  topic: string;
  description: string;
  sessionTime: string;
  accentBorder: string;
  badgeBg: string;
}

export const Speakers: React.FC = () => {
  const speakers: RoleSpeaker[] = [
    {
      id: 'ai-ml',
      field: 'AI & Machine Learning',
      role: 'Technical Speaker',
      monogram: 'ML',
      topic: 'Foundations of Modern AI & Algorithmic Optimization',
      description: 'Focusing on core machine learning pipelines, deep neural architectures, and scalable inference techniques.',
      sessionTime: '10:00 AM · Main Auditorium Hall',
      accentBorder: 'hover:border-blue-500/40',
      badgeBg: 'bg-blue-600/15 text-blue-400 border-blue-500/20',
    },
    {
      id: 'gen-ai',
      field: 'Generative AI',
      role: 'Technology Speaker',
      monogram: 'GA',
      topic: 'Multimodal Generation, Context-Aware Systems & Tooling',
      description: 'Covering transformer mechanisms, context window management, and application workflows in generative systems.',
      sessionTime: '11:00 AM · Session Hall A',
      accentBorder: 'hover:border-purple-500/40',
      badgeBg: 'bg-purple-600/15 text-purple-400 border-purple-500/20',
    },
    {
      id: 'robotics',
      field: 'Robotics',
      role: 'Technical Speaker',
      monogram: 'RO',
      topic: 'Computer Vision, Spatial Perception & Autonomous Systems',
      description: 'Addressing visual feature learning, real-time spatial navigation, and control loop integrations.',
      sessionTime: '01:00 PM · Session Hall B',
      accentBorder: 'hover:border-cyan-500/40',
      badgeBg: 'bg-cyan-600/15 text-cyan-400 border-cyan-500/20',
    },
    {
      id: 'future-tech',
      field: 'Future Technology',
      role: 'Industry / Academic Speaker',
      monogram: 'FT',
      topic: 'Emerging AI Horizons & Responsible Technology Deployment',
      description: 'Examining future technological shifts, alignment guidelines, and practical considerations for engineering teams.',
      sessionTime: '03:30 PM · Main Auditorium Hall',
      accentBorder: 'hover:border-indigo-500/40',
      badgeBg: 'bg-indigo-600/15 text-indigo-400 border-indigo-500/20',
    },
  ];

  return (
    <section id="speakers" className="py-20 lg:py-28 relative bg-[#07111F] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16 text-left">
          <div className="text-xs sm:text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-3">
            Speakers & Session Leads
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Distinguished Session Leaders
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Technical speakers and symposium panelists leading specialized sessions across core
            domains of artificial intelligence.
          </p>
        </div>

        {/* 4 Clean Monogram-based Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {speakers.map((speaker) => (
            <div
              key={speaker.id}
              className={`p-7 rounded-2xl bg-[#0B172A] border border-white/10 ${speaker.accentBorder} transition-all duration-200 flex flex-col justify-between`}
            >
              <div>
                {/* Monogram Avatar */}
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-lg font-bold text-white mb-6">
                  {speaker.monogram}
                </div>

                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  {speaker.role}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {speaker.field}
                </h3>

                <div className="text-xs font-semibold text-cyan-300 mb-3 leading-snug">
                  {speaker.topic}
                </div>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                  {speaker.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{speaker.sessionTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
