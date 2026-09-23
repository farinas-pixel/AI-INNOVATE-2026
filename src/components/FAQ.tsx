import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'What is AI INNOVATE 2026?',
      answer:
        'AI INNOVATE 2026 is a student-focused technology symposium exploring Artificial Intelligence, Generative AI, Computer Vision, Robotics, and emerging technologies through technical talks, project presentations, and interactive discussions.',
    },
    {
      question: 'Who can participate?',
      answer:
        'Undergraduate and postgraduate students, researchers, faculty members, and technology enthusiasts interested in exploring artificial intelligence concepts and applications are welcome to participate.',
    },
    {
      question: 'Is registration required?',
      answer:
        'Yes, advance registration is mandatory to ensure seating and event access. Upon completing the registration form, you will receive a digital delegate pass with a unique Registration ID for entrance check-in.',
    },
    {
      question: 'Is the event free?',
      answer:
        'Yes, attendance for AI INNOVATE 2026 is free of charge for students and academic delegates. Prior registration is required due to auditorium capacity limits.',
    },
    {
      question: 'Will participants receive certificates?',
      answer:
        'Certificate availability depends on the event organizer. Any participation credentials or certificates of attendance will be issued in accordance with symposium guidelines after attendance verification.',
    },
    {
      question: 'Should participants bring laptops?',
      answer:
        'Bringing a personal laptop is recommended if you wish to follow along during technical walkthroughs or access demonstration repositories, though it is not strictly required to attend the sessions.',
    },
    {
      question: 'Where is the venue?',
      answer:
        'The symposium takes place at the Innovation Auditorium on 18 October 2026 from 09:00 AM to 04:30 PM. Directional signage will be posted from the campus main gate.',
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 relative bg-[#07111F] border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14 text-left">
          <div className="text-xs sm:text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-3">
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-slate-300">
            Answers to common questions regarding registration, sessions, and participation.
          </p>
        </div>

        {/* Accordion Stack */}
        <div className="space-y-3.5 text-left">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-[#0B172A] border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 text-white hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <span className="text-base sm:text-lg font-bold tracking-tight">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-cyan-400 bg-cyan-950/40' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    className="px-6 pb-6 text-sm sm:text-base text-slate-300 leading-relaxed animate-fade-in border-t border-white/5 pt-4"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
