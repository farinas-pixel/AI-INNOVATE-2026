import React, { useState, useEffect } from 'react';
import { RegistrationTicket } from '../types/index.ts';
import { X, Search, Ticket, ExternalLink, AlertCircle, Info } from 'lucide-react';

interface SavedPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTicket: (ticket: RegistrationTicket) => void;
}

export const SavedPassModal: React.FC<SavedPassModalProps> = ({
  isOpen,
  onClose,
  onSelectTicket,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  let savedTickets: RegistrationTicket[] = [];
  try {
    const stored = localStorage.getItem('ai_innovate_2026_tickets');
    savedTickets = stored ? JSON.parse(stored) : [];
  } catch {
    savedTickets = [];
  }

  const queryTrimmed = searchQuery.trim().toLowerCase();
  const filteredTickets = queryTrimmed
    ? savedTickets.filter(
        (t) =>
          t.ticketNumber.toLowerCase().includes(queryTrimmed) ||
          t.registerNumber.toLowerCase().includes(queryTrimmed) ||
          t.fullName.toLowerCase().includes(queryTrimmed) ||
          t.email.toLowerCase().includes(queryTrimmed)
      )
    : savedTickets;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pass-lookup-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#0B172A] border border-white/15 rounded-2xl p-6 sm:p-7 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <Ticket className="w-5 h-5 text-cyan-400" />
          <h3 id="pass-lookup-title" className="text-xl font-bold text-white">
            Lookup Saved Delegate Pass
          </h3>
        </div>

        {/* Demo Storage Disclaimer */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300 mb-5">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-white">Demo / Client-Side Storage:</strong> Pass lookup retrieves
            registration credentials stored in your current browser session. It is not connected to a
            central authentication database.
          </span>
        </div>

        {/* Search by Registration ID or Name */}
        <div className="relative mb-5">
          <label htmlFor="passSearchInput" className="block text-xs font-semibold text-slate-300 mb-2">
            Enter Registration ID or Participant Name
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="passSearchInput"
              type="text"
              placeholder="e.g. AI26-P101-8942 or Full Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#07111F] border border-white/10 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Pass List */}
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {savedTickets.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <AlertCircle className="w-6 h-6 text-slate-500 mx-auto mb-2" />
              <p className="text-slate-300 font-medium">
                No saved pass found. Please complete registration first.
              </p>
              <a
                href="#register"
                onClick={onClose}
                className="mt-3 inline-block px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
              >
                Go to Registration
              </a>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No pass matching &ldquo;{searchQuery}&rdquo; found in local demo storage.
            </div>
          ) : (
            filteredTickets.map((t) => (
              <div
                key={t.id}
                onClick={() => {
                  onSelectTicket(t);
                  onClose();
                }}
                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/40 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {t.fullName}
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    ID: {t.ticketNumber} · Roll: {t.registerNumber}
                  </div>
                  <div className="text-[11px] text-cyan-400 mt-1">{t.department}</div>
                </div>
                <div className="shrink-0 flex items-center gap-1 text-xs text-cyan-400 font-medium group-hover:translate-x-1 transition-transform">
                  <span>View Pass</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>{savedTickets.length} local demo pass(es) saved</span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
