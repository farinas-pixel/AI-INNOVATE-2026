import React from 'react';
import { Calendar, Clock, MapPin, ArrowRight, ArrowDown } from 'lucide-react';
import { AiGlassOrb } from './AiGlassOrb.tsx';

interface HeroProps {
  onRegisterClick: () => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRegisterClick, onExploreClick }) => {
  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden"
    >
      {/* Background subtle radial lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-12 right-12 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Meta */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Small Eyebrow */}
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>AI INNOVATE 2026</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] mb-6">
              Explore AI.
              <span className="block text-slate-200 mt-1">Build the Future.</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed mb-8">
              AI INNOVATE 2026 is a student-focused technology symposium exploring
              Artificial Intelligence, Generative AI, Computer Vision, Robotics and emerging
              technologies.
            </p>

            {/* Event Information Bar */}
            <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 mb-8 rounded-2xl bg-[#0B172A] border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Date</div>
                  <div className="text-xs sm:text-sm font-semibold text-white">18 October 2026</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600/15 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Time</div>
                  <div className="text-xs sm:text-sm font-semibold text-white">09:00 AM – 04:30 PM</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-600/15 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Venue</div>
                  <div className="text-xs sm:text-sm font-semibold text-white truncate" title="Innovation Auditorium">
                    Innovation Auditorium
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onRegisterClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-150 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Register Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onExploreClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-slate-200 hover:text-white bg-[#0B172A] hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-colors cursor-pointer"
              >
                <span>Explore Event</span>
                <ArrowDown className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Right Column: 3D AI Glass Orb */}
          <div className="lg:col-span-5 flex items-center justify-center w-full">
            <div className="w-full max-w-[460px] lg:max-w-none">
              <AiGlassOrb />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
