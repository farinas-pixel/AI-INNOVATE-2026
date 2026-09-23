import React, { useState, useRef } from 'react';
import { RegistrationFormData, RegistrationTicket } from '../types/index.ts';
import { FORMSPREE_ENDPOINT, isFormspreeConfigured } from '../config/formspree.ts';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Send,
  RefreshCw,
  Info,
} from 'lucide-react';

interface RegistrationFormProps {
  onSuccess: (ticket: RegistrationTicket) => void;
}

type SubmissionState = 'idle' | 'editing' | 'validating' | 'submitting' | 'error' | 'success';

interface FormErrors {
  fullName?: string;
  registerNumber?: string;
  department?: string;
  yearOfStudy?: string;
  email?: string;
  mobileNumber?: string;
  selectedSession?: string;
  reasonForAttending?: string;
  consent?: string;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: '',
    registerNumber: '',
    department: '',
    yearOfStudy: '',
    email: '',
    mobileNumber: '',
    selectedSession: '',
    reasonForAttending: '',
    consent: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const isSubmittingRef = useRef<boolean>(false);

  const isConfigured = isFormspreeConfigured(FORMSPREE_ENDPOINT);

  const departments = [
    'Computer Science & Engineering',
    'Artificial Intelligence & Data Science',
    'Information Technology',
    'Electronics & Communication Engineering',
    'Electrical & Electronics Engineering',
    'Mechanical Engineering',
    'Other Academic Department / Organization',
  ];

  const yearOptions = [
    '1st Year Undergraduate',
    '2nd Year Undergraduate',
    '3rd Year Undergraduate',
    '4th Year Undergraduate',
    'Postgraduate / Research Scholar',
    'Faculty / Industry Delegate',
  ];

  const sessionTracks = [
    'Track 1: Foundations of AI & Machine Learning',
    'Track 2: Generative AI & Multimodal Systems',
    'Track 3: Computer Vision & Robotics',
    'Track 4: Edge AI & Micro-Inference',
    'Track 5: Responsible AI & Emerging Trends',
    'All Sessions (Full-Day Symposium Pass)',
  ];

  // Helper to validate a single field
  const validateField = (name: keyof RegistrationFormData, value: unknown): string => {
    switch (name) {
      case 'fullName':
        if (!value || typeof value !== 'string' || value.trim().length < 2) {
          return 'Please enter your full name.';
        }
        return '';

      case 'registerNumber':
        if (!value || typeof value !== 'string' || value.trim().length < 3) {
          return 'Please enter your register number.';
        }
        return '';

      case 'department':
        if (!value || typeof value !== 'string' || value.trim() === '') {
          return 'Please select your department.';
        }
        return '';

      case 'yearOfStudy':
        if (!value || typeof value !== 'string' || value.trim() === '') {
          return 'Please select your year of study.';
        }
        return '';

      case 'email': {
        if (!value || typeof value !== 'string') {
          return 'Enter a valid email address.';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(value.trim())) {
          return 'Enter a valid email address.';
        }
        return '';
      }

      case 'mobileNumber': {
        if (!value || typeof value !== 'string') {
          return 'Enter a valid 10-digit mobile number.';
        }
        // Normalize: remove spaces, dashes, +91, 0 prefix
        const cleaned = value.replace(/[\s\-()]/g, '').replace(/^(\+91|91|0)/, '');
        // Valid 10-digit Indian mobile starting with 6, 7, 8, 9
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(cleaned)) {
          return 'Enter a valid 10-digit mobile number.';
        }
        return '';
      }

      case 'selectedSession':
        if (!value || typeof value !== 'string' || value.trim() === '') {
          return 'Please select a session track preference.';
        }
        return '';

      case 'reasonForAttending':
        if (!value || typeof value !== 'string' || value.trim().length < 15) {
          return 'Please enter at least 15 characters describing your reason for attending.';
        }
        return '';

      case 'consent':
        if (value !== true) {
          return 'Please accept the Code of Conduct.';
        }
        return '';

      default:
        return '';
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const fieldValue = type === 'checkbox' ? checked : value;

    if (submissionState !== 'submitting') {
      setSubmissionState('editing');
    }

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Inline validation: clear error if now valid
    const err = validateField(name as keyof RegistrationFormData, fieldValue);
    setErrors((prev) => ({
      ...prev,
      [name]: err ? err : undefined,
    }));
  };

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as (keyof RegistrationFormData)[]).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) {
        newErrors[key] = err;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate submissions / multiple clicks
    if (isSubmittingRef.current || submissionState === 'submitting') {
      return;
    }

    setSubmissionState('validating');
    const isValid = validateAll();

    if (!isValid) {
      setSubmissionState('idle');
      // Scroll to the first error
      const firstErrorField = document.querySelector('[aria-invalid="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Set lock
    isSubmittingRef.current = true;
    setSubmissionState('submitting');
    setErrorMessage('');

    try {
      const ticketNumber = `AI26-P${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`;

      if (isConfigured) {
        // Live Formspree submission
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ticketNumber,
            fullName: formData.fullName,
            registerNumber: formData.registerNumber,
            department: formData.department,
            yearOfStudy: formData.yearOfStudy,
            email: formData.email,
            mobileNumber: formData.mobileNumber,
            selectedSession: formData.selectedSession,
            reasonForAttending: formData.reasonForAttending,
            submissionTimestamp: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          let errorDetail = `Registration submission failed (${response.status}). Please verify your input and try again.`;
          try {
            const data = await response.json();
            if (data?.errors && Array.isArray(data.errors)) {
              const msg = data.errors
                .map((item: { message?: string; field?: string }) => item.message || item.field)
                .filter(Boolean)
                .join(', ');
              if (msg) errorDetail = msg;
            } else if (data?.error) {
              errorDetail = data.error;
            }
          } catch {
            // Response was not JSON
          }
          throw new Error(errorDetail);
        }
      } else {
        // Preview / Demo Mode simulation (600ms latency for realistic UX)
        await new Promise((resolve) => setTimeout(resolve, 600));
      }

      // Minimal safe verification QR string
      const hashId = Math.abs(
        formData.fullName.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
      )
        .toString(16)
        .toUpperCase();
      const qrData = `AI26::PASS::${ticketNumber}::V:${hashId}`;

      const newTicket: RegistrationTicket = {
        id: crypto.randomUUID ? crypto.randomUUID() : `ticket-${Date.now()}`,
        registeredAt: new Date().toISOString(),
        ticketNumber,
        qrCodeData: qrData,
        status: 'confirmed',
        ...formData,
      };

      // Persist in local demo storage
      try {
        const stored = localStorage.getItem('ai_innovate_2026_tickets');
        const tickets: RegistrationTicket[] = stored ? JSON.parse(stored) : [];
        tickets.unshift(newTicket);
        localStorage.setItem('ai_innovate_2026_tickets', JSON.stringify(tickets));
      } catch (storageErr) {
        console.warn('Could not save ticket to localStorage', storageErr);
      }

      setSubmissionState('success');
      // Pass data to parent success handler
      onSuccess(newTicket);
    } catch (err: unknown) {
      setSubmissionState('error');
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Unable to submit registration. Please check your network connection and try again.'
      );
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return (
    <section id="register" className="py-20 lg:py-28 relative bg-[#07111F] border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12 text-left">
          <div className="text-xs sm:text-sm font-semibold text-blue-400 uppercase tracking-widest mb-3">
            Registration
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Register for AI INNOVATE 2026
          </h2>
          <p className="mt-3 text-base text-slate-300 leading-relaxed">
            Reserve your seat for the symposium on 18 October 2026 at Innovation Auditorium.
            All fields marked with <span className="text-cyan-400 font-bold">*</span> are required.
          </p>

          {/* Mode Indicator Banner */}
          <div className="mt-6 flex items-start sm:items-center gap-3 p-3.5 rounded-xl bg-[#0B172A] border border-white/10 text-xs">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 sm:mt-0" />
            <div className="text-slate-300">
              {isConfigured ? (
                <span>
                  <strong className="text-white">Active Submission:</strong> Submissions will be sent
                  directly to your configured Formspree endpoint.
                </span>
              ) : (
                <span>
                  <strong className="text-cyan-300">Demonstration Mode:</strong> No Formspree
                  endpoint is configured in <code className="text-slate-200">src/config/formspree.ts</code>.
                  Submissions are simulated and saved locally to issue your digital pass and QR code immediately.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Error Banner on submission failure */}
        {submissionState === 'error' && (
          <div
            role="alert"
            className="mb-8 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm animate-fade-in"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <div className="font-semibold text-white">Submission Error</div>
                <div className="text-xs sm:text-sm text-red-300">{errorMessage}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Submission</span>
            </button>
          </div>
        )}

        {/* Registration Form Card */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="p-6 sm:p-10 rounded-2xl bg-[#0B172A] border border-white/10 shadow-2xl text-left"
        >
          <div className="space-y-6">
            {/* Row 1: Full Name & Register Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-xs font-semibold text-slate-300 mb-2">
                  Full Name <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Alex Johnson"
                  disabled={submissionState === 'submitting'}
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                  className={`w-full px-4 py-3 rounded-xl bg-[#07111F] text-white text-sm border focus:outline-none transition-colors ${
                    errors.fullName
                      ? 'border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-400'
                      : 'border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  }`}
                />
                {errors.fullName && (
                  <p id="fullName-error" className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="registerNumber" className="block text-xs font-semibold text-slate-300 mb-2">
                  Register Number <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  id="registerNumber"
                  name="registerNumber"
                  value={formData.registerNumber}
                  onChange={handleChange}
                  placeholder="e.g. 22CS0104 or Delegate ID"
                  disabled={submissionState === 'submitting'}
                  aria-invalid={!!errors.registerNumber}
                  aria-describedby={errors.registerNumber ? 'registerNumber-error' : undefined}
                  className={`w-full px-4 py-3 rounded-xl bg-[#07111F] text-white text-sm border focus:outline-none transition-colors ${
                    errors.registerNumber
                      ? 'border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-400'
                      : 'border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  }`}
                />
                {errors.registerNumber && (
                  <p id="registerNumber-error" className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.registerNumber}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Department & Year of Study */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="department" className="block text-xs font-semibold text-slate-300 mb-2">
                  Department / Organization <span className="text-cyan-400">*</span>
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  disabled={submissionState === 'submitting'}
                  aria-invalid={!!errors.department}
                  aria-describedby={errors.department ? 'department-error' : undefined}
                  className={`w-full px-4 py-3 rounded-xl bg-[#07111F] text-white text-sm border focus:outline-none transition-colors ${
                    errors.department
                      ? 'border-red-500 focus:border-red-400'
                      : 'border-white/10 focus:border-blue-500'
                  }`}
                >
                  <option value="">Select your department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p id="department-error" className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.department}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="yearOfStudy" className="block text-xs font-semibold text-slate-300 mb-2">
                  Year of Study <span className="text-cyan-400">*</span>
                </label>
                <select
                  id="yearOfStudy"
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  disabled={submissionState === 'submitting'}
                  aria-invalid={!!errors.yearOfStudy}
                  aria-describedby={errors.yearOfStudy ? 'yearOfStudy-error' : undefined}
                  className={`w-full px-4 py-3 rounded-xl bg-[#07111F] text-white text-sm border focus:outline-none transition-colors ${
                    errors.yearOfStudy
                      ? 'border-red-500 focus:border-red-400'
                      : 'border-white/10 focus:border-blue-500'
                  }`}
                >
                  <option value="">Select year of study</option>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.yearOfStudy && (
                  <p id="yearOfStudy-error" className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.yearOfStudy}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Row 3: Email & Indian Mobile Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-300 mb-2">
                  Email Address <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  disabled={submissionState === 'submitting'}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={`w-full px-4 py-3 rounded-xl bg-[#07111F] text-white text-sm border focus:outline-none transition-colors ${
                    errors.email
                      ? 'border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-400'
                      : 'border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  }`}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="mobileNumber" className="block text-xs font-semibold text-slate-300 mb-2">
                  Mobile Number <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="10-digit number (e.g. 9876543210)"
                  disabled={submissionState === 'submitting'}
                  aria-invalid={!!errors.mobileNumber}
                  aria-describedby={errors.mobileNumber ? 'mobileNumber-error' : undefined}
                  className={`w-full px-4 py-3 rounded-xl bg-[#07111F] text-white text-sm border focus:outline-none transition-colors ${
                    errors.mobileNumber
                      ? 'border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-400'
                      : 'border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  }`}
                />
                {errors.mobileNumber && (
                  <p id="mobileNumber-error" className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.mobileNumber}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Row 4: Session Preference */}
            <div>
              <label htmlFor="selectedSession" className="block text-xs font-semibold text-slate-300 mb-2">
                Session Track Preference <span className="text-cyan-400">*</span>
              </label>
              <select
                id="selectedSession"
                name="selectedSession"
                value={formData.selectedSession}
                onChange={handleChange}
                disabled={submissionState === 'submitting'}
                aria-invalid={!!errors.selectedSession}
                aria-describedby={errors.selectedSession ? 'selectedSession-error' : undefined}
                className={`w-full px-4 py-3 rounded-xl bg-[#07111F] text-white text-sm border focus:outline-none transition-colors ${
                  errors.selectedSession
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-white/10 focus:border-blue-500'
                }`}
              >
                <option value="">Select your session preference</option>
                {sessionTracks.map((track) => (
                  <option key={track} value={track}>
                    {track}
                  </option>
                ))}
              </select>
              {errors.selectedSession && (
                <p id="selectedSession-error" className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.selectedSession}</span>
                </p>
              )}
            </div>

            {/* Row 5: Reason for Attending */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="reasonForAttending" className="text-xs font-semibold text-slate-300">
                  Reason for Attending <span className="text-cyan-400">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  {formData.reasonForAttending.length}/15 chars min
                </span>
              </div>
              <textarea
                id="reasonForAttending"
                name="reasonForAttending"
                rows={3}
                value={formData.reasonForAttending}
                onChange={handleChange}
                placeholder="Briefly state your technical interests or what you hope to explore at AI INNOVATE 2026..."
                disabled={submissionState === 'submitting'}
                aria-invalid={!!errors.reasonForAttending}
                aria-describedby={errors.reasonForAttending ? 'reasonForAttending-error' : undefined}
                className={`w-full px-4 py-3 rounded-xl bg-[#07111F] text-white text-sm border focus:outline-none transition-colors ${
                  errors.reasonForAttending
                    ? 'border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-400'
                    : 'border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                }`}
              />
              {errors.reasonForAttending && (
                <p id="reasonForAttending-error" className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.reasonForAttending}</span>
                </p>
              )}
            </div>

            {/* Row 6: Consent Checkbox */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="consent"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  disabled={submissionState === 'submitting'}
                  aria-invalid={!!errors.consent}
                  className="mt-1 w-4 h-4 rounded border-slate-700 bg-[#07111F] text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-xs text-slate-300 leading-relaxed">
                  I agree to abide by the symposium Code of Conduct and confirm that the submitted
                  details are accurate for event verification and pass generation.{' '}
                  <span className="text-cyan-400">*</span>
                </span>
              </label>
              {errors.consent && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.consent}</span>
                </p>
              )}
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant delegate pass generated upon verification</span>
              </div>

              <button
                type="submit"
                disabled={submissionState === 'submitting' || submissionState === 'validating'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-150 cursor-pointer"
              >
                {submissionState === 'submitting' || submissionState === 'validating' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Registration...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Complete Registration</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};
