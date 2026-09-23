import React, { useState, useEffect } from 'react';
import { Menu, X, Ticket, Sparkles, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenPassLookup: () => void;
  hasSavedTicket: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPassLookup, hasSavedTicket }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sectionIds = ['hero', 'about', 'schedule', 'speakers', 'register'];
      const scrollPos = window.scrollY + 120;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Home', href: '#hero', id: 'hero' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Schedule', href: '#schedule', id: 'schedule' },
    { label: 'Speakers', href: '#speakers', id: 'speakers' },
    { label: 'Register', href: '#register', id: 'register' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href === '#hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#07111F]/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20 py-3.5'
          : 'bg-[#07111F]/40 backdrop-blur-sm border-b border-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Wordmark */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#hero');
            }}
            className="flex items-center gap-2.5 text-base sm:text-lg font-bold tracking-tight text-white group"
            aria-label="AI INNOVATE 2026 Home"
          >
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-4 h-4 text-cyan-300" />
            </span>
            <span className="text-white font-extrabold tracking-tight">
              AI INNOVATE <span className="text-cyan-400">2026</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-7 text-sm font-medium"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`relative py-1 transition-colors duration-150 ${
                    isActive ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Action Zone: My Pass & Register */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenPassLookup}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white bg-[#0B172A] hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-colors cursor-pointer"
              title="Look up your saved delegate pass"
            >
              <Ticket className="w-3.5 h-3.5 text-cyan-400" />
              <span>My Pass</span>
              {hasSavedTicket && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" title="Pass saved" />
              )}
            </button>

            <a
              href="#register"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#register');
              }}
              className="hidden sm:inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl shadow-md shadow-blue-600/25 transition-all duration-150 hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Register Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-drawer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Accessible Full-Width Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="md:hidden fixed inset-x-0 top-[60px] max-h-[calc(100vh-60px)] overflow-y-auto bg-[#07111F]/95 backdrop-blur-xl border-b border-white/10 px-5 py-6 shadow-2xl z-50 flex flex-col gap-4 animate-fade-in"
        >
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600/15 text-white font-semibold border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-white/10 space-y-2.5">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPassLookup();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-200 bg-[#0B172A] border border-slate-700/80 rounded-xl cursor-pointer"
            >
              <Ticket className="w-4 h-4 text-cyan-400" />
              <span>Lookup My Pass</span>
            </button>

            <a
              href="#register"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#register');
              }}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md cursor-pointer"
            >
              <span>Register Now</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
