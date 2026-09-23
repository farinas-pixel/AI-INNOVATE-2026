import React, { useState, useEffect } from 'react';
import { RegistrationTicket } from './types/index.ts';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { About } from './components/About.tsx';
import { WhyAttend } from './components/WhyAttend.tsx';
import { TechCards } from './components/TechCards.tsx';
import { Schedule } from './components/Schedule.tsx';
import { Speakers } from './components/Speakers.tsx';
import { RegistrationForm } from './components/RegistrationForm.tsx';
import { RegistrationSuccess } from './components/RegistrationSuccess.tsx';
import { FAQ } from './components/FAQ.tsx';
import { Contact } from './components/Contact.tsx';
import { Footer } from './components/Footer.tsx';
import { SavedPassModal } from './components/SavedPassModal.tsx';
import { IntroExperience } from './components/IntroExperience.tsx';
import { CustomObjectCursor } from './components/CustomObjectCursor.tsx';

export default function App() {
  const [activeTicket, setActiveTicket] = useState<RegistrationTicket | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [hasSavedTickets, setHasSavedTickets] = useState(false);
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return sessionStorage.getItem('ai_innovate_intro_shown') !== 'true';
    } catch {
      return false;
    }
  });
  const [introKey, setIntroKey] = useState(0);

  const handleIntroComplete = () => {
    setShowIntro(false);
    try {
      sessionStorage.setItem('ai_innovate_intro_shown', 'true');
    } catch {
      // Ignore
    }
  };

  const handleReplayIntro = () => {
    setIntroKey((prev) => prev + 1);
    setShowIntro(true);
  };

  // Check if there are any existing registered passes on initial load
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ai_innovate_2026_tickets');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHasSavedTickets(true);
        }
      }
    } catch {
      // Ignore
    }
  }, [activeTicket]);

  const handleRegistrationSuccess = (ticket: RegistrationTicket) => {
    setActiveTicket(ticket);
    setHasSavedTickets(true);
    // Smooth scroll to the success section
    setTimeout(() => {
      const el = document.getElementById('registration-success') || document.getElementById('register');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleRegisterAnother = () => {
    setActiveTicket(null);
    setTimeout(() => {
      const el = document.getElementById('register');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleSelectSavedTicket = (ticket: RegistrationTicket) => {
    setActiveTicket(ticket);
    setTimeout(() => {
      const el = document.getElementById('registration-success') || document.getElementById('register');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const scrollToRegister = () => {
    const el = document.getElementById('register');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToAbout = () => {
    const el = document.getElementById('about');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-[#F8FAFC] selection:bg-blue-600 selection:text-white flex flex-col relative">
      {/* 3D Glass Object Cursor */}
      <CustomObjectCursor />

      {/* Cinematic Intro Experience */}
      {showIntro && <IntroExperience key={introKey} onComplete={handleIntroComplete} />}

      {/* 1. Sticky Navbar */}
      <Navbar
        onOpenPassLookup={() => setIsPassModalOpen(true)}
        hasSavedTicket={hasSavedTickets}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero onRegisterClick={scrollToRegister} onExploreClick={scrollToAbout} />

        {/* 3. About Event */}
        <About />

        {/* 4. Why Attend */}
        <WhyAttend />

        {/* 5. AI Technology Cards */}
        <TechCards />

        {/* 6. Event Schedule */}
        <Schedule />

        {/* 7. Speakers */}
        <Speakers />

        {/* 8 & 9. Registration Section / Registration Success State */}
        {activeTicket ? (
          <div className="border-t border-cyan-500/20 bg-gradient-to-b from-[#0B172A]/80 to-[#07111F]">
            <RegistrationSuccess
              ticket={activeTicket}
              onRegisterAnother={handleRegisterAnother}
            />
          </div>
        ) : (
          <RegistrationForm onSuccess={handleRegistrationSuccess} />
        )}

        {/* 10. FAQ */}
        <FAQ />

        {/* 11. Contact */}
        <Contact />
      </main>

      {/* 12. Footer */}
      <Footer onReplayIntro={handleReplayIntro} />

      {/* Saved Delegate Pass Modal */}
      <SavedPassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        onSelectTicket={handleSelectSavedTicket}
      />
    </div>
  );
}
