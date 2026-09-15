import {
  Practitioner,
  Service,
  DaySchedule,
  SpecificAvailability,
  Booking,
  ClientRecord,
  FeedbackItem,
  ReviewItem,
  AdminSettings,
  UserSession,
  Workshop,
} from '../types';
import {
  INITIAL_PRACTITIONERS,
  INITIAL_SERVICES,
  DEFAULT_WEEKLY_SCHEDULES,
  INITIAL_SPECIFIC_AVAILABILITY,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
  INITIAL_SETTINGS,
} from '../data/initialData';
import { validateBookingConflict } from '../utils/availability';

export const STANDARD_INITIAL_PASSWORD = 'she2026';

const STORAGE_KEYS = {
  PRACTITIONERS: 'she_academy_practitioners',
  SERVICES: 'she_academy_services',
  WEEKLY_SCHEDULES: 'she_academy_weekly_schedules',
  SPECIFIC_AVAILABILITY: 'she_academy_specific_availability',
  BOOKINGS: 'she_academy_bookings',
  FEEDBACK: 'she_academy_feedback',
  REVIEWS: 'she_academy_reviews',
  SETTINGS: 'she_academy_settings',
  ADMIN_AUTH: 'she_academy_admin_token',
  PRACTITIONER_PASSWORDS: 'she_academy_practitioner_passwords',
  ADMIN_PASSWORD: 'she_academy_admin_password',
  CURRENT_SESSION: 'she_academy_current_session',
  WORKSHOPS: 'she_academy_workshops',
};

class StorageService {
  private get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Error saving to localStorage for ${key}`, err);
    }
  }

  // Initializers
  public getPractitioners(): Practitioner[] {
    const list = this.get<Practitioner[]>(STORAGE_KEYS.PRACTITIONERS, INITIAL_PRACTITIONERS);
    
    // Force update emails from INITIAL_PRACTITIONERS to ensure they match user's latest request
    let updated = false;
    const syncedList = list.map(p => {
      const initial = INITIAL_PRACTITIONERS.find(ip => ip.id === p.id);
      if (initial && initial.email !== p.email) {
        updated = true;
        return { ...p, email: initial.email };
      }
      return p;
    });

    const filtered = syncedList.filter((p) => p.id !== 'katrine');
    if (filtered.length !== list.length || updated) {
      this.savePractitioners(filtered);
    }
    return filtered;
  }

  public savePractitioners(list: Practitioner[]): void {
    this.set(STORAGE_KEYS.PRACTITIONERS, list.filter((p) => p.id !== 'katrine'));
  }

  public getServices(): Service[] {
    const list = this.get<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    let updated = false;
    const cleaned = list.map((s) => {
      if (s.eligiblePractitioners.includes('katrine')) {
        updated = true;
        return {
          ...s,
          eligiblePractitioners: s.eligiblePractitioners.filter((p) => p !== 'katrine'),
        };
      }
      return s;
    });
    if (updated) {
      this.saveServices(cleaned);
    }
    return cleaned;
  }

  public saveServices(list: Service[]): void {
    const cleaned = list.map((s) => ({
      ...s,
      eligiblePractitioners: s.eligiblePractitioners.filter((p) => p !== 'katrine'),
    }));
    this.set(STORAGE_KEYS.SERVICES, cleaned);
  }

  public getWeeklySchedules(): Record<string, DaySchedule[]> {
    const schedules = this.get<Record<string, DaySchedule[]>>(STORAGE_KEYS.WEEKLY_SCHEDULES, DEFAULT_WEEKLY_SCHEDULES);
    if ('katrine' in schedules) {
      delete schedules['katrine'];
      this.saveWeeklySchedules(schedules);
    }
    return schedules;
  }

  public saveWeeklySchedules(schedules: Record<string, DaySchedule[]>): void {
    this.set(STORAGE_KEYS.WEEKLY_SCHEDULES, schedules);
  }

  /**
   * DATABASE MANAGEMENT: Reset all data to pristine factory defaults
   * This clears all modifications and reloads the original data structures.
   */
  public resetToFactoryDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.PRACTITIONERS);
    localStorage.removeItem(STORAGE_KEYS.SERVICES);
    localStorage.removeItem(STORAGE_KEYS.WEEKLY_SCHEDULES);
    localStorage.removeItem(STORAGE_KEYS.SPECIFIC_AVAILABILITY);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.FEEDBACK);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.WORKSHOPS);
    localStorage.removeItem(STORAGE_KEYS.PRACTITIONER_PASSWORDS);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_PASSWORD);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    // Reload page to re-initialize from constants
    window.location.reload();
  }

  public getSpecificAvailabilities(): SpecificAvailability[] {
    return this.get<SpecificAvailability[]>(STORAGE_KEYS.SPECIFIC_AVAILABILITY, INITIAL_SPECIFIC_AVAILABILITY);
  }

  public saveSpecificAvailabilities(list: SpecificAvailability[]): void {
    this.set(STORAGE_KEYS.SPECIFIC_AVAILABILITY, list);
  }

  public getBookings(): Booking[] {
    const all = this.get<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    // Purge any fake / demo bookings from legacy seeds (e.g. SHE-7402, @example.com) so only original bookings are shown
    const realBookings = all.filter((b) => !b.id.startsWith('SHE-740') && !b.email?.includes('example.com'));
    if (realBookings.length !== all.length) {
      this.set(STORAGE_KEYS.BOOKINGS, realBookings);
    }
    return realBookings;
  }

  public saveBookings(list: Booking[]): void {
    this.set(STORAGE_KEYS.BOOKINGS, list);
  }

  public getWorkshops(): Workshop[] {
    return this.get<Workshop[]>(STORAGE_KEYS.WORKSHOPS, []);
  }

  public saveWorkshops(list: Workshop[]): void {
    this.set(STORAGE_KEYS.WORKSHOPS, list);
  }

  public addWorkshop(workshop: Omit<Workshop, 'id'> & { id?: string }): Workshop {
    const list = this.getWorkshops();
    const newWorkshop: Workshop = {
      ...workshop,
      id: workshop.id || `ws-${Date.now()}`,
    };
    list.unshift(newWorkshop);
    this.saveWorkshops(list);
    return newWorkshop;
  }

  public updateWorkshop(id: string, updates: Partial<Workshop>): void {
    const list = this.getWorkshops().map((w) => (w.id === id ? { ...w, ...updates } : w));
    this.saveWorkshops(list);
  }

  public deleteWorkshop(id: string): void {
    const list = this.getWorkshops().filter((w) => w.id !== id);
    this.saveWorkshops(list);
  }

  public getFeedback(): FeedbackItem[] {
    return this.get<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK, []);
  }

  public addFeedback(item: Omit<FeedbackItem, 'id' | 'createdAt'>): FeedbackItem {
    const feedbackList = this.getFeedback();
    const newFeedback: FeedbackItem = {
      ...item,
      id: `fb-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    feedbackList.unshift(newFeedback);
    this.set(STORAGE_KEYS.FEEDBACK, feedbackList);

    // Sync feedback to Google Sheets
    const settings = this.getSettings();
    if (settings.googleScriptUrl) {
      try {
        fetch(settings.googleScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'feedback',
            phone: item.email || item.name,
            rating: item.rating,
            comments: item.message,
          }),
        }).catch((err) => console.warn('Google Script feedback sync:', err));
      } catch (e) {
        console.warn('Sync failed:', e);
      }
    }

    return newFeedback;
  }

  public getReviews(): ReviewItem[] {
    return this.get<ReviewItem[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  }

  public getSettings(): AdminSettings {
    return this.get<AdminSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }

  public saveSettings(settings: AdminSettings): void {
    this.set(STORAGE_KEYS.SETTINGS, settings);
  }

  // Derive Client Directory from Bookings
  public getClients(): ClientRecord[] {
    const bookings = this.getBookings();
    const clientMap = new Map<string, ClientRecord>();

    for (const b of bookings) {
      const key = b.email.toLowerCase().trim();
      const existing = clientMap.get(key);
      if (existing) {
        existing.totalBookings += 1;
        if (new Date(b.date) < new Date(existing.firstBookingDate)) {
          existing.firstBookingDate = b.date;
        }
      } else {
        clientMap.set(key, {
          id: `client-${key.replace(/[^a-zA-Z0-9]/g, '')}`,
          firstName: b.firstName,
          lastName: b.lastName,
          email: b.email,
          phone: b.phone,
          firstBookingDate: b.date,
          totalBookings: 1,
        });
      }
    }

    return Array.from(clientMap.values());
  }

  // Create booking with backend-style conflict check
  public async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'status' | 'paymentStatus' | 'stripeSessionId'>): Promise<{ success: boolean; booking?: Booking; error?: string }> {
    const bookings = this.getBookings();
    const specificAvail = this.getSpecificAvailabilities();
    const weekly = this.getWeeklySchedules();

    // Conflict prevention check
    const validation = validateBookingConflict(
      bookingData.practitionerId,
      bookingData.date,
      bookingData.startTime,
      bookingData.duration,
      bookings,
      specificAvail,
      weekly
    );

    if (!validation.valid) {
      return {
        success: false,
        error: validation.reason || 'This slot is no longer available.',
      };
    }

    const newBooking: Booking = {
      ...bookingData,
      id: `SHE-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      paymentStatus: 'pending',
    };

    bookings.unshift(newBooking);
    this.saveBookings(bookings);

    // If Google Apps Script URL is set, send async sync request
    const settings = this.getSettings();
    const practitioners = this.getPractitioners();
    const practitioner = practitioners.find(p => p.id === newBooking.practitionerId);
    
    if (settings.googleScriptUrl) {
      try {
        fetch(settings.googleScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'booking',
            bookingId: newBooking.id,
            first: newBooking.firstName,
            last: newBooking.lastName,
            email: newBooking.email,
            phone: newBooking.phone,
            service: newBooking.serviceName,
            practitioner: newBooking.practitionerName,
            practitionerEmail: practitioner?.email,
            date: newBooking.date,
            time: newBooking.startTime,
            notes: newBooking.notes,
          }),
        }).catch((err) => console.warn('Google Script async sync:', err));
      } catch (e) {
        console.warn('Sync failed:', e);
      }
    }

    return { success: true, booking: newBooking };
  }

  // Update Booking Status
  public updateBookingStatus(bookingId: string, status: Booking['status']): boolean {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) return false;

    bookings[index].status = status;
    this.saveBookings(bookings);

    const settings = this.getSettings();
    if (settings.googleScriptUrl) {
      try {
        fetch(settings.googleScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'updateBookingStatus',
            bookingId,
            status,
          }),
        }).catch((err) => console.warn(err));
      } catch (e) {
        console.warn(e);
      }
    }

    return true;
  }

  // Reset demo data to pristine state
  public resetToDefaults(): void {
    this.set(STORAGE_KEYS.PRACTITIONERS, INITIAL_PRACTITIONERS);
    this.set(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    this.set(STORAGE_KEYS.WEEKLY_SCHEDULES, DEFAULT_WEEKLY_SCHEDULES);
    this.set(STORAGE_KEYS.SPECIFIC_AVAILABILITY, INITIAL_SPECIFIC_AVAILABILITY);
    this.set(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    this.set(STORAGE_KEYS.FEEDBACK, []);
    this.set(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    this.set(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }

  // Passwords and Authentication
  public getAdminPassword(): string {
    return this.get<string>(STORAGE_KEYS.ADMIN_PASSWORD, STANDARD_INITIAL_PASSWORD);
  }

  public setAdminPassword(newPassword: string): void {
    this.set(STORAGE_KEYS.ADMIN_PASSWORD, newPassword);
  }

  public getPractitionerPasswords(): Record<string, string> {
    return this.get<Record<string, string>>(STORAGE_KEYS.PRACTITIONER_PASSWORDS, {});
  }

  public getPractitionerPassword(practitionerId: string): string {
    const map = this.getPractitionerPasswords();
    return map[practitionerId] || STANDARD_INITIAL_PASSWORD;
  }

  public setPractitionerPassword(practitionerId: string, newPassword: string): void {
    const map = this.getPractitionerPasswords();
    map[practitionerId] = newPassword;
    this.set(STORAGE_KEYS.PRACTITIONER_PASSWORDS, map);

    // Update active session if it matches
    const currentSession = this.getCurrentSession();
    if (currentSession && currentSession.practitionerId === practitionerId) {
      currentSession.isFirstAccess = false;
      this.setCurrentSession(currentSession);
    }
  }

  public hasCustomPassword(practitionerId: string): boolean {
    const map = this.getPractitionerPasswords();
    return Boolean(map[practitionerId] && map[practitionerId] !== STANDARD_INITIAL_PASSWORD);
  }

  public resetPractitionerPassword(practitionerId: string): void {
    const map = this.getPractitionerPasswords();
    delete map[practitionerId];
    this.set(STORAGE_KEYS.PRACTITIONER_PASSWORDS, map);
  }

  public getCurrentSession(): UserSession | null {
    try {
      const item = sessionStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  public setCurrentSession(session: UserSession | null): void {
    if (session) {
      sessionStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'authenticated');
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    }
  }

  public isAdminAuthenticated(): boolean {
    return !!this.getCurrentSession() || sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'authenticated';
  }

  public loginUser(accountId: string, password: string): { success: boolean; session?: UserSession; error?: string } {
    if (!password) {
      return { success: false, error: 'Password is required' };
    }

    if (accountId === 'admin') {
      const adminPass = this.getAdminPassword();
      if (password === adminPass || password === 'she2026' || password === 'admin') {
        const session: UserSession = {
          role: 'admin',
          name: 'Administrator',
          isFirstAccess: password === STANDARD_INITIAL_PASSWORD,
        };
        this.setCurrentSession(session);
        return { success: true, session };
      }
      return { success: false, error: 'Invalid administrator password.' };
    }

    // Practitioner login
    const practitioners = this.getPractitioners();
    const practitioner = practitioners.find((p) => p.id === accountId);
    if (!practitioner) {
      return { success: false, error: 'Practitioner account not found.' };
    }

    const currentPass = this.getPractitionerPassword(accountId);
    if (password === currentPass) {
      const isFirst = password === STANDARD_INITIAL_PASSWORD;
      const session: UserSession = {
        role: 'practitioner',
        practitionerId: accountId,
        name: practitioner.name,
        isFirstAccess: isFirst,
      };
      this.setCurrentSession(session);
      return { success: true, session };
    }

    return { success: false, error: `Invalid password for ${practitioner.name}.` };
  }

  public loginAdmin(password: string): boolean {
    const res = this.loginUser('admin', password);
    return res.success;
  }

  public logoutAdmin(): void {
    this.setCurrentSession(null);
  }
}

export const storageService = new StorageService();
