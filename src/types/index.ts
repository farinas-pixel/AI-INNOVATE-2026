export interface RegistrationFormData {
  fullName: string;
  registerNumber: string;
  department: string;
  yearOfStudy: string;
  email: string;
  mobileNumber: string;
  selectedSession: string;
  reasonForAttending: string;
  consent: boolean;
}

export interface FormErrors {
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

export interface RegistrationTicket extends RegistrationFormData {
  id: string;
  registeredAt: string;
  ticketNumber: string;
  qrCodeData: string;
  status: 'confirmed';
}

export interface Speaker {
  id: string;
  name: string;
  role: string;
  organization: string;
  topic: string;
  bio: string;
  sessionTime: string;
  initials: string;
  accentColor: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  speaker?: string;
  location: string;
  track: 'all' | 'keynote' | 'track-session' | 'masterclass' | 'networking';
  description: string;
  tag: string;
}

export interface TechCardData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  technologies: string[];
  keyOutcome: string;
  practicalSession: string;
  gradient: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'eligibility' | 'logistics';
}
