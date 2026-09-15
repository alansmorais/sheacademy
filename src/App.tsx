import React, { useState, useEffect, useCallback } from 'react';
import { Calendar } from 'lucide-react';
import {
  Practitioner,
  Service,
  DaySchedule,
  SpecificAvailability,
  Booking,
  ReviewItem,
  AdminSettings,
  Workshop,
} from './types';
import { storageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ForWomenView } from './components/ForWomenView';
import { ForMenView } from './components/ForMenView';
import { WorkshopsView } from './components/WorkshopsView';
import { BookingModal } from './components/BookingModal';
import { FeedbackDrawer } from './components/FeedbackDrawer';
import { ContactModal } from './components/ContactModal';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  // Force Light Theme Only
  const theme = 'light';

  // Navigation View: 'home' | 'women' | 'men' | 'workshops' | 'admin'
  const [currentView, setCurrentView] = useState<'home' | 'women' | 'men' | 'workshops' | 'admin'>('home');

  // Data Store State
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [weeklySchedules, setWeeklySchedules] = useState<Record<string, DaySchedule[]>>({});
  const [specificAvailabilities, setSpecificAvailabilities] = useState<SpecificAvailability[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    googleScriptUrl: '',
    adminEmail: 'info@she-academy.com',
    sendClientEmails: true,
    sendAdminEmails: true,
    currencySymbol: ' kr',
    defaultBufferMinutes: 15,
  });

  // Modal / Drawer Overlays
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingServiceId, setBookingServiceId] = useState<string | undefined>(undefined);
  const [bookingPractitionerId, setBookingPractitionerId] = useState<string | undefined>(undefined);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [prefilledContactMessage, setPrefilledContactMessage] = useState<string>('');
  const [stripeSuccessBooking, setStripeSuccessBooking] = useState<Booking | null>(null);

  // Fetch reviews directly from your live Google Sheet doGet endpoint
  const fetchGoogleReviews = useCallback(async () => {
    const settings = storageService.getSettings();
    if (!settings.googleScriptUrl) return;
    try {
      const response = await fetch(settings.googleScriptUrl);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          const mapped: ReviewItem[] = data.map((item: any, idx: number) => ({
            id: `gs-review-${idx}-${Date.now()}`,
            author: 'Verified Client',
            rating: item.rating ? Number(item.rating) : 5,
            text: item.text || item.comments || '',
            serviceName: 'Somatic Session',
            practitionerName: 'SHE. Faculty',
            date: item.date || new Date().toLocaleDateString(),
          }));
          
          setReviews((prev) => {
            const localReviews = storageService.getReviews();
            const combined = [...mapped, ...localReviews.filter(lr => !lr.id.startsWith('gs-review'))];
            // Filter unique by text comments (normalized to ignore spacing, typos like weenkend/weekend, punctuation, and casing)
            const unique = combined.filter((v, i, a) => {
              const norm = (str: string) => str.toLowerCase().replace(/[^a-z]/g, '').replace('weenkend', 'weekend');
              return a.findIndex(t => norm(t.text) === norm(v.text)) === i;
            });
            return unique;
          });
        }
      }
    } catch (e) {
      console.warn('Could not fetch reviews from Google Sheets:', e);
    }
  }, []);

  // Load all central data
  const loadData = useCallback(() => {
    setPractitioners(storageService.getPractitioners());
    setServices(storageService.getServices());
    setWorkshops(storageService.getWorkshops());
    setWeeklySchedules(storageService.getWeeklySchedules());
    setSpecificAvailabilities(storageService.getSpecificAvailabilities());
    setBookings(storageService.getBookings());
    setReviews(storageService.getReviews());
    setAdminSettings(storageService.getSettings());
  }, []);

  useEffect(() => {
    loadData();
    fetchGoogleReviews();
    // Force light theme
    document.documentElement.setAttribute('data-theme', 'light');

    // Check URL for Stripe redirect parameters
    const params = new URLSearchParams(window.location.search);
    if (params.get('booking-success') === 'true') {
      const bookingId = params.get('booking-id');
      if (bookingId) {
        const allBookings = storageService.getBookings();
        const found = allBookings.find(b => b.id === bookingId);
        if (found) {
          setStripeSuccessBooking(found);
          setIsBookingOpen(true);
        }
      }
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get('booking-cancelled') === 'true') {
      alert('Booking cancelled. No payment was processed.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check URL hash for direct admin routing (e.g. #admin)
    const hash = window.location.hash;
    if (hash === '#admin') {
      setCurrentView('admin');
    }
  }, [loadData, fetchGoogleReviews]);

  // Dynamic SEO updater per view
  useEffect(() => {
    const seoData: Record<string, { title: string; description: string }> = {
      home: {
        title: 'SHE. Academy – Somatic Bodywork, Intimacy & Embodiment',
        description: 'SHE. Academy offers conscious bodywork, intimacy education, somatic healing, pelvic health, and professional workshops for women and men in a safe, consent-led space.',
      },
      women: {
        title: 'For Women | SHE. Academy – Somatic Bodywork & Pelvic Health',
        description: 'Explore somatic bodywork, pelvic mapping, de-armouring, cycle-aware training, pregnancy & postpartum care for women at SHE. Academy. Safe, trauma-informed, and consent-led.',
      },
      men: {
        title: 'For Men | SHE. Academy – Intimacy & Somatic Care',
        description: 'Dedicated somatic bodywork, prostate mapping, emotional release, and intimate coaching for men at SHE. Academy. Safe, professional, and confidential.',
      },
      workshops: {
        title: 'Workshops & Immersions | SHE. Academy',
        description: 'Join immersive group workshops, intimacy immersions, and men\'s circles at SHE. Academy. Experience the healing power of conscious community.',
      },
      admin: {
        title: 'Admin Dashboard | SHE. Academy',
        description: 'SHE. Academy administration and booking management dashboard.',
      },
    };

    const current = seoData[currentView] || seoData.home;
    document.title = current.title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', current.description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', current.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', current.description);
  }, [currentView]);

  // Apply data-theme to document element (No-op in light-only mode)
  const handleThemeChange = (_newTheme: 'light' | 'dark' | 'terra') => {
    document.documentElement.setAttribute('data-theme', 'light');
  };

  // Open booking modal helper
  const handleOpenBooking = (serviceId?: string, practitionerId?: string) => {
    let mappedServiceId = serviceId;
    if (serviceId && !services.some(s => s.id === serviceId)) {
      if (serviceId.startsWith('prostate-') || serviceId.startsWith('scars-') || serviceId.startsWith('erection-') || serviceId.startsWith('pornography-')) {
        mappedServiceId = 'mens-practices-2h';
      } else if (serviceId === 'face-massage-men-2h') {
        mappedServiceId = 'face-massage-2h';
      } else if (serviceId === 'sensual-massage' || serviceId === 'de-armouring' || serviceId === 'pelvic-mapping') {
        mappedServiceId = `${serviceId}-2h`;
      } else if (serviceId === 'pregnancy-massage') {
        mappedServiceId = 'pregnancy-massage-2h';
      }
    }
    setBookingServiceId(mappedServiceId);
    setBookingPractitionerId(practitionerId);
    setIsBookingOpen(true);
  };

  const handleOpenContact = (message?: string) => {
    setPrefilledContactMessage(message || '');
    setIsContactOpen(true);
  };

  const handleBookingSuccess = (_newBooking: Booking) => {
    loadData();
  };

  // View Navigation
  const handleNavigate = (view: 'home' | 'women' | 'men' | 'workshops' | 'admin', targetId?: string) => {
    setCurrentView(view);
    if (view === 'admin') {
      window.location.hash = 'admin';
    } else {
      if (window.location.hash === '#admin') {
        history.pushState(null, '', ' ');
      }
    }
    if (targetId && view === 'home') {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // If Admin View is active, render full Admin Dashboard interface
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-main text-main">
        <AdminDashboard
          practitioners={practitioners}
          services={services}
          workshops={workshops}
          weeklySchedules={weeklySchedules}
          specificAvailabilities={specificAvailabilities}
          bookings={bookings}
          settings={adminSettings}
          onRefreshData={loadData}
          onClose={() => handleNavigate('home')}
        />
      </div>
    );
  }

  return (
    <div id="she-app" className="min-h-screen flex flex-col bg-main text-main font-sans antialiased selection:bg-accent-editorial selection:text-white">
      {/* Top Editorial Navbar with Exact Logo and Links */}
      <Navbar
        currentTheme={theme}
        onThemeChange={handleThemeChange}
        activeView={currentView}
        onNavigate={handleNavigate as (v: string, t?: string) => void}
        onOpenBooking={() => handleOpenBooking()}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-20 sm:pb-12">
        {currentView === 'home' && (
          <HomeView
            services={services}
            practitioners={practitioners}
            reviews={reviews}
            onOpenBooking={handleOpenBooking}
            onNavigateView={handleNavigate}
            onOpenFeedback={() => setIsFeedbackOpen(true)}
            onOpenContact={() => setIsContactOpen(true)}
          />
        )}

        {currentView === 'women' && (
          <ForWomenView
            services={services}
            practitioners={practitioners}
            onOpenBooking={handleOpenBooking}
          />
        )}

        {currentView === 'men' && (
          <ForMenView
            services={services}
            practitioners={practitioners}
            onOpenBooking={handleOpenBooking}
            onOpenContact={handleOpenContact}
          />
        )}

        {currentView === 'workshops' && (
          <WorkshopsView
            workshops={workshops}
            onOpenBooking={handleOpenBooking}
            onOpenContact={handleOpenContact}
          />
        )}
      </main>

      {/* Editorial Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onNavigate={handleNavigate as (v: string, t?: string) => void}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onOpenContact={() => handleOpenContact()}
      />

      {/* Sticky Mobile CTA Bar (Matching Original) */}
      <div
        id="sticky-book"
        onClick={() => handleOpenBooking()}
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-alt border-t border-line text-center py-3 text-[10px] uppercase tracking-[0.14em] font-semibold text-main cursor-pointer"
      >
        Book a Session
      </div>

      {/* Floating Book a Session Button (Desktop/Tablet Persistent/Scroll Action) */}
      <button
        type="button"
        id="floating-book-button"
        onClick={() => handleOpenBooking()}
        className="hidden sm:flex fixed bottom-6 right-6 z-40 items-center space-x-2 bg-[#32231F] text-[#FCFAF7] hover:bg-[#B05B43] px-5 py-3 rounded-full shadow-lg border border-line transition-all duration-300 hover:scale-105 cursor-pointer font-semibold uppercase tracking-[0.14em] text-[10px]"
        aria-label="Book a Session"
      >
        <Calendar className="w-3.5 h-3.5 text-[#B05B43]" />
        <span>Book a Session</span>
      </button>

      {/* Right Side Rotated Feedback Trigger (From Original HTML) */}
      <button
        type="button"
        id="feedback-trigger"
        onClick={() => setIsFeedbackOpen(true)}
        className="hidden md:block fixed -right-7 top-1/2 -translate-y-1/2 -rotate-90 origin-top-left bg-[#32231F] text-[#FCFAF7] px-3.5 py-1.5 text-[10px] uppercase tracking-[0.15em] font-semibold border border-[#32231F] shadow-sm rounded-b-xs z-40 hover:bg-[#B05B43] hover:text-white transition-all cursor-pointer"
        aria-label="Feedback"
      >
        Feedback
      </button>

      {/* 8-Step Availability-Driven Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setStripeSuccessBooking(null);
        }}
        services={services}
        practitioners={practitioners}
        weeklySchedules={weeklySchedules}
        specificAvailabilities={specificAvailabilities}
        existingBookings={bookings}
        initialServiceId={bookingServiceId}
        initialPractitionerId={bookingPractitionerId}
        onBookingSuccess={handleBookingSuccess}
        stripeConfirmedBooking={stripeSuccessBooking || undefined}
      />

      {/* Client Feedback Drawer */}
      <FeedbackDrawer
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        reviews={reviews}
      />

      {/* Contact Inquiry Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => {
          setIsContactOpen(false);
          setPrefilledContactMessage('');
        }}
        prefilledMessage={prefilledContactMessage}
      />
    </div>
  );
}
