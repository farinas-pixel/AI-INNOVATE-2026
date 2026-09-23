import React from 'react';
import { Sparkles, ArrowUp, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onReplayIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onReplayIntro }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Schedule', href: '#schedule' },
    { label: 'Speakers', href: '#speakers' },
    { label: 'Register', href: '#register' },
  ];

  const handleLinkClick = (href: string) => {
    if (href === '#hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#07111F] border-t border-white/10 pt-16 pb-12 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/5">
          {/* Brand Column */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
                <Sparkles className="w-4 h-4 text-cyan-300" />
              </span>
              <span className="text-xl font-extrabold text-white tracking-tight">
                AI INNOVATE <span className="text-cyan-400">2026</span>
              </span>
            </div>

            <p className="text-slate-200 text-sm font-medium">
              “Explore AI. Build the Future.”
            </p>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Student Technology Symposium on Artificial Intelligence, Generative Models, Robotics,
              and Computer Vision. Held on 18 October 2026 at Innovation Auditorium.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
              Quick Links
            </div>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.href);
                    }}
                    className="text-slate-400 hover:text-white transition-colors duration-150 inline-block py-0.5"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* System Status & Event Metadata */}
          <div className="md:col-span-3 space-y-4">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              System Status
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300 p-3 rounded-xl bg-[#0B172A] border border-white/5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Registration Portal: Active</span>
            </div>

            <div className="text-xs text-slate-400 space-y-1">
              <div>Date: 18 October 2026</div>
              <div>Time: 09:00 AM – 04:30 PM</div>
              <div>Venue: Innovation Auditorium</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 AI INNOVATE. Student Technology Symposium. All rights reserved.
          </div>

          <div className="flex items-center gap-3">
            {onReplayIntro && (
              <button
                type="button"
                onClick={onReplayIntro}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-white bg-[#0B172A] hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
                aria-label="Replay intro animation"
              >
                <span>Replay Intro</span>
              </button>
            )}

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-300 hover:text-white bg-[#0B172A] hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
