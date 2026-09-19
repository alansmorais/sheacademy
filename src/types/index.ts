export type Theme = 'light' | 'dark' | 'terra';

export interface Practitioner {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  services: string[]; // service IDs
  active: boolean;
  gender: 'female' | 'male' | 'other';
  email: string;
  phone: string;
}

export interface Service {
  id: string;
  name: string;
  category: 'women' | 'men' | 'general' | 'movement' | 'workshops' | 'bodywork' | 'maternal' | 'training';
  description: string;
  duration: number; // in minutes (60, 75, 90, 120, 180, 240)
  price: number;
  currency: string;
  eligiblePractitioners: string[]; // practitioner IDs
  active: boolean;
}

export interface Workshop {
  id: string;
  title: string;
  date: string;
  subtitle?: string;
  time?: string;
  location?: string;
  facilitators?: string[];
  capacity?: number;
  spotsLeft?: number;
  status?: 'open' | 'closed' | 'sold_out';
  price?: number;
  currency?: string;
  description?: string;
  curriculum?: string[];
  image?: string;
}

export interface TimeSlot {
  start: string; // HH:MM
  end: string;   // HH:MM
}

export interface DaySchedule {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  isOff: boolean;
  slots: TimeSlot[];
}

export interface SpecificAvailability {
  id: string;
  practitionerId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  type: 'AVAILABLE' | 'BLOCKED' | 'TIME_OFF';
  notes?: string;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No-show';

export interface Booking {
  id: string;
  createdAt: string;
  status: BookingStatus;
  paymentStatus: 'pending' | 'paid' | 'failed';
  stripeSessionId?: string;
  serviceId: string;
  serviceName: string;
  practitionerId: string;
  practitionerName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  duration: number;  // in minutes
  price: number;
  currency: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface ClientRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  firstBookingDate: string;
  totalBookings: number;
  notes?: string;
}

export interface FeedbackItem {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  rating: number;
  category: string;
  message: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  practitionerName: string;
  serviceName: string;
  text: string;
  rating: number;
  date: string;
}

export interface AdminSettings {
  googleScriptUrl: string;
  adminEmail: string;
  developerPassword?: string;
  sendClientEmails: boolean;
  sendAdminEmails: boolean;
  currencySymbol: string;
  defaultBufferMinutes: number;
  lastSynced?: string;
}

export interface UserSession {
  role: 'admin' | 'practitioner';
  practitionerId?: string;
  name: string;
  isFirstAccess?: boolean;
}

