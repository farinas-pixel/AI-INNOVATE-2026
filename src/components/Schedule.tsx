import React, { useState } from 'react';
import { Clock, MapPin, Tag } from 'lucide-react';

interface TimelineEvent {
  time: string;
  title: string;
  category: 'all' | 'keynote' | 'breakout' | 'masterclass' | 'networking';
  tag: string;
  location: string;
  description: string;
}

export const Schedule: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'keynote' | 'breakout' | 'masterclass' | 'networking'>('all');

  const events: TimelineEvent[] = [
    {
      time: '09:00 AM',
      title: 'Registration & Welcome',
      category: 'networking',
      tag: 'Check-in',
      location: 'Grand Foyer, Innovation Auditorium',
      description: 'Attendee badge verification, event kit collection, and welcome networking.',
    },
    {
      time: '09:30 AM',
      title: 'Opening Session',
      category: 'keynote',
      tag: 'Opening',
      location: 'Main Auditorium Hall',
      description: 'Welcome address, symposium overview, and introduction of the technology tracks.',
    },
    {
      time: '10:00 AM',
      title: 'AI & Future Technology',
      category: 'keynote',
      tag: 'Keynote',
      location: 'Main Auditorium Hall',
      description: 'Foundational perspectives on modern machine learning, systems architecture, and future trajectories.',
    },
    {
      time: '11:00 AM',
      title: 'Generative AI Session',
      category: 'breakout',
      tag: 'Breakout Track',
      location: 'Session Hall A',
      description: 'In-depth exploration of large models, multimodal generation, and context-aware tooling.',
    },
    {
      time: '12:00 PM',
      title: 'Networking Break',
      category: 'networking',
      tag: 'Networking',
      location: 'Dining & Community Gallery',
      description: 'Lunch and informal interaction among attendees, speakers, and student project teams.',
    },
    {
      time: '01:00 PM',
      title: 'Computer Vision & Robotics',
      category: 'breakout',
      tag: 'Breakout Track',
      location: 'Session Hall B',
      description: 'Perception algorithms, visual scene analysis, and robotic integration walkthroughs.',
    },
    {
      time: '02:00 PM',
      title: 'AI Project Showcase',
      category: 'masterclass',
      tag: 'Showcase & Masterclass',
      location: 'Exhibition Arena',
      description: 'Live demonstrations of student-built AI applications, prototypes, and applied solutions.',
    },
    {
      time: '03:30 PM',
      title: 'Future Trends in AI',
      category: 'keynote',
      tag: 'Panel Discussion',
      location: 'Main Auditorium Hall',
      description: 'Discussion on emerging research, responsible deployment, and career pathways in artificial intelligence.',
    },
    {
      time: '04:15 PM',
      title: 'Closing Session',
      category: 'keynote',
      tag: 'Closing Ceremony',
      location: 'Main Auditorium Hall',
      description: 'Summary remarks, acknowledgment of participants and student organizers.',
    },
    {
      time: '04:30 PM',
      title: 'Event Ends',
      category: 'networking',
      tag: 'Conclusion',
      location: 'Innovation Auditorium',
      description: 'Symposium conclusion and departure.',
    },
  ];

  const filterTabs = [
    { id: 'all', label: 'All Sessions' },
    { id: 'keynote', label: 'Keynotes & Panels' },
    { id: 'breakout', label: 'Breakout Tracks' },
    { id: 'masterclass', label: 'Masterclasses' },
    { id: 'networking', label: 'Networking' },
  ] as const;

  const filteredEvents = events.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  return (
    <section id="schedule" className="py-20 lg:py-28 relative bg-[#07111F] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 text-left">
          <div className="max-w-2xl">
            <div className="text-xs sm:text-sm font-semibold text-purple-400 uppercase tracking-widest mb-3">
              Event Schedule
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Symposium Agenda
            </h2>
            <p className="mt-3 text-base text-slate-300">
              18 October 2026 · 09:00 AM – 04:30 PM · Innovation Auditorium
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#0B172A] border border-white/10 rounded-2xl">
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  aria-pressed={isActive}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeline Stack */}
        <div className="space-y-3.5 text-left">
          {filteredEvents.map((item, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-[#0B172A] border border-white/10 hover:border-white/20 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Time & Venue */}
              <div className="md:w-1/4 shrink-0">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-cyan-400 font-mono">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>{item.time}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.location}</span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="md:w-3/4">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <span className="text-blue-400 font-medium">{item.tag}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
