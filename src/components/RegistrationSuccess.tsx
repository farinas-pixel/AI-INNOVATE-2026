import React, { useEffect, useRef } from 'react';
import { RegistrationTicket } from '../types/index.ts';
import { generateQRMatrix } from '../utils/qrCode.ts';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Download,
  Printer,
  CalendarPlus,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

interface RegistrationSuccessProps {
  ticket: RegistrationTicket;
  onRegisterAnother: () => void;
}

export const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({
  ticket,
  onRegisterAnother,
}) => {
  const badgeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#7C3AED', '#06B6D4', '#FFFFFF'],
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  // Safe minimal QR matrix: only verification ID and checksum
  const qrMatrix = generateQRMatrix(ticket.ticketNumber || ticket.id);

  // Google Calendar URL
  const gcalTitle = encodeURIComponent('AI INNOVATE 2026');
  const gcalDetails = encodeURIComponent(
    `Registration ID: ${ticket.ticketNumber}\nEvent: AI INNOVATE 2026\nVenue: Innovation Auditorium\nTime: 09:00 AM – 04:30 PM`
  );
  const gcalLocation = encodeURIComponent('Innovation Auditorium');
  // 18 Oct 2026: 09:00 to 16:30 local
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${gcalTitle}&dates=20261018T090000/20261018T163000&details=${gcalDetails}&location=${gcalLocation}`;

  // Download .ics file
  const handleDownloadICS = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AI INNOVATE 2026//Event Registration//EN',
      'BEGIN:VEVENT',
      'UID:' + ticket.ticketNumber + '@aiinnovate2026.edu',
      'DTSTAMP:20261018T000000Z',
      'DTSTART:20261018T090000',
      'DTEND:20261018T163000',
      'SUMMARY:AI INNOVATE 2026',
      'DESCRIPTION:Registration ID: ' + ticket.ticketNumber + ' | Event: AI INNOVATE 2026',
      'LOCATION:Innovation Auditorium',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AI_INNOVATE_2026_${ticket.ticketNumber}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="registration-success" className="py-16 lg:py-24 relative bg-[#07111F]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header Notification */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-1">
            REGISTRATION CONFIRMED
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            AI INNOVATE 2026
          </h2>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            Your registration is confirmed. Your digital delegate pass is ready below.
          </p>
        </div>

        {/* Digital Delegate Pass Card (Printable) */}
        <div
          ref={badgeRef}
          className="printable-ticket max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#0B172A] border border-white/15 shadow-2xl relative overflow-hidden text-left"
        >
          {/* Top colored accent line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-cyan-400 to-purple-600" />

          {/* Ticket Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-6 border-b border-white/10 gap-4">
            <div>
              <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                DELEGATE CREDENTIAL
              </div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight mt-1">
                AI INNOVATE 2026
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Explore AI. Build the Future.</p>
            </div>
            <div className="sm:text-right">
              <div className="text-[11px] text-slate-400 uppercase font-medium">Registration ID</div>
              <div className="text-sm font-mono font-bold text-cyan-300 tracking-wider">
                {ticket.ticketNumber}
              </div>
              <div className="inline-flex items-center gap-1 text-[11px] text-emerald-400 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Status: Confirmed</span>
              </div>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Left Column: Attendee Data */}
            <div className="sm:col-span-8 space-y-4">
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Participant Name
                </div>
                <div className="text-lg font-bold text-white">{ticket.fullName}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Register Number
                  </div>
                  <div className="text-xs sm:text-sm font-mono text-slate-200">
                    {ticket.registerNumber}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Year of Study
                  </div>
                  <div className="text-xs sm:text-sm text-slate-200 truncate">
                    {ticket.yearOfStudy}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Department / Organization
                </div>
                <div className="text-xs sm:text-sm text-slate-200">
                  {ticket.department}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Session Track Preference
                </div>
                <div className="text-xs sm:text-sm font-medium text-cyan-300">
                  {ticket.selectedSession}
                </div>
              </div>
            </div>

            {/* Right Column: QR Verification Visual */}
            <div className="sm:col-span-4 flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl">
              <div className="w-28 h-28 bg-white p-2 rounded-xl flex items-center justify-center shadow-md">
                <svg
                  viewBox="0 0 25 25"
                  className="w-full h-full"
                  shapeRendering="crispEdges"
                  aria-label="Pass Verification Code"
                >
                  {qrMatrix.map((row, r) =>
                    row.map((cell, c) =>
                      cell ? (
                        <rect
                          key={`${r}-${c}`}
                          x={c}
                          y={r}
                          width="1"
                          height="1"
                          fill="#07111F"
                        />
                      ) : null
                    )
                  )}
                </svg>
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-2 text-center">
                Scan for Check-in
              </div>
            </div>
          </div>

          {/* Ticket Footer */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>18 October 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400 shrink-0" />
              <span>09:00 AM – 04:30 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="truncate">Innovation Auditorium</span>
            </div>
          </div>
        </div>

        {/* Action Controls (Hidden on Print) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 no-print">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#0B172A] hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>Print / Save PDF</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadICS}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-[#0B172A] hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-purple-400" />
            <span>Download .ICS</span>
          </button>

          <a
            href={gcalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-[#0B172A] hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4 text-emerald-400" />
            <span>Google Calendar</span>
          </a>

          <button
            type="button"
            onClick={onRegisterAnother}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-medium text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Register Another Attendee</span>
          </button>
        </div>
      </div>
    </section>
  );
};
