import React, { useState } from 'react';
import { MapPin, Mail, Phone, Clock, Send, CheckCircle2, Info } from 'lucide-react';

export const Contact: React.FC = () => {
  const [enquirySent, setEnquirySent] = useState(false);
  const [enquiryData, setEnquiryData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryData.name || !enquiryData.email || !enquiryData.message) return;
    setEnquirySent(true);
    setTimeout(() => {
      setEnquiryData({ name: '', email: '', subject: '', message: '' });
    }, 2500);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 relative bg-[#07111F] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
          {/* Left Column: Contact & Venue Info */}
          <div className="lg:col-span-5">
            <div className="text-xs sm:text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-3">
              Help Desk & Venue
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              Symposium Help Desk
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              For questions regarding registration, scheduling, student delegations, or venue directions,
              our symposium support team is here to help.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Venue
                  </div>
                  <div className="text-sm font-semibold text-white mt-0.5">
                    Innovation Auditorium
                  </div>
                  <div className="text-xs text-slate-400">
                    Campus Technology Complex
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-600/15 border border-purple-500/25 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Email Desk
                  </div>
                  <div className="text-sm font-semibold text-white mt-0.5">
                    helpdesk@ai-innovate-demo.edu
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    (Demonstration Project Placeholder)
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-600/15 border border-cyan-500/25 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Help Desk Helpline
                  </div>
                  <div className="text-sm font-semibold text-white mt-0.5">
                    +91 (0) 00000 00000
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    (Demonstration Project Placeholder)
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Date & Hours
                  </div>
                  <div className="text-sm font-semibold text-white mt-0.5">
                    18 October 2026 · 09:00 AM – 04:30 PM
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-7 sm:p-8 rounded-2xl bg-[#0B172A] border border-white/10 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-2">Send an Inquiry</h3>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">
                Have a question regarding team attendance, schedule specifics, or accessibility accommodations?
              </p>

              {enquirySent ? (
                <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2 animate-fade-in">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <div className="font-semibold text-white">Inquiry Received</div>
                  <p className="text-xs text-emerald-300">
                    Thank you. In demonstration mode, your query has been recorded.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="inquiry-name" className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Your Name
                      </label>
                      <input
                        id="inquiry-name"
                        type="text"
                        required
                        placeholder="e.g. Jordan Smith"
                        value={enquiryData.name}
                        onChange={(e) => setEnquiryData({ ...enquiryData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#07111F] text-white text-xs sm:text-sm border border-white/10 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="inquiry-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Your Email
                      </label>
                      <input
                        id="inquiry-email"
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={enquiryData.email}
                        onChange={(e) => setEnquiryData({ ...enquiryData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#07111F] text-white text-xs sm:text-sm border border-white/10 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="inquiry-subject" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Subject
                    </label>
                    <input
                      id="inquiry-subject"
                      type="text"
                      placeholder="e.g. Student Group Attendance"
                      value={enquiryData.subject}
                      onChange={(e) => setEnquiryData({ ...enquiryData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#07111F] text-white text-xs sm:text-sm border border-white/10 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="inquiry-message" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Message
                    </label>
                    <textarea
                      id="inquiry-message"
                      required
                      rows={4}
                      placeholder="Write your query..."
                      value={enquiryData.message}
                      onChange={(e) => setEnquiryData({ ...enquiryData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#07111F] text-white text-xs sm:text-sm border border-white/10 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
