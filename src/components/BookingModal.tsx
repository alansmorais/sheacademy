import React, { useState, useEffect, useMemo } from 'react';
import {
  Practitioner,
  Service,
  DaySchedule,
  SpecificAvailability,
  Booking,
} from '../types';
import {
  getAvailableSlotsForDate,
  getBookableDates,
  SlotOption,
} from '../utils/availability';
import { storageService } from '../services/storageService';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Download,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  practitioners: Practitioner[];
  weeklySchedules: Record<string, DaySchedule[]>;
  specificAvailabilities: SpecificAvailability[];
  existingBookings: Booking[];
  initialServiceId?: string;
  initialPractitionerId?: string;
  onBookingSuccess?: (booking: Booking) => void;
  stripeConfirmedBooking?: Booking;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  services,
  practitioners,
  weeklySchedules,
  specificAvailabilities,
  existingBookings,
  initialServiceId,
  initialPractitionerId,
  onBookingSuccess,
  stripeConfirmedBooking,
}) => {
  // Wizard steps: 1 = Service, 2 = Practitioner, 3 = Calendar Date, 4 & 5 = Time Slot, 6 = Client Info, 7 = Summary, 8 = Confirmation
  const [step, setStep] = useState<number>(1);

  // Selected values
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedPractitionerId, setSelectedPractitionerId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(''); // YYYY-MM-DD
  const [selectedSlot, setSelectedSlot] = useState<SlotOption | null>(null);

  // Client Details Form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Calendar month navigation
  const [viewDate, setViewDate] = useState<Date>(new Date());

  // Status & Error handling
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Initialize or reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      
      if (stripeConfirmedBooking) {
        setConfirmedBooking(stripeConfirmedBooking);
        setStep(8);
        return;
      }

      setConfirmedBooking(null);

      if (initialPractitionerId) {
        setSelectedPractitionerId(initialPractitionerId);
        if (initialServiceId) {
          setSelectedServiceId(initialServiceId);
          setStep(3); // jump straight to calendar
        } else {
          setStep(2); // select service
        }
      } else {
        setSelectedPractitionerId('');
        setSelectedServiceId(initialServiceId || '');
        setStep(1); // start at practitioner selection
      }
    }
  }, [isOpen, initialServiceId, initialPractitionerId]);

  // Eligible services for the selected practitioner
  const eligibleServices = useMemo(() => {
    if (!selectedPractitionerId) return services.filter((s) => s.active);
    return services.filter(
      (s) => s.active && s.eligiblePractitioners.includes(selectedPractitionerId)
    );
  }, [selectedPractitionerId, services]);

  // Current selected practitioner object
  const currentPractitioner = useMemo(() => {
    return practitioners.find((p) => p.id === selectedPractitionerId);
  }, [practitioners, selectedPractitionerId]);

  // Current selected service object
  const currentService = useMemo(() => {
    return services.find((s) => s.id === selectedServiceId);
  }, [services, selectedServiceId]);

  // Compute bookable dates for the current practitioner & service duration (next 60 days)
  const bookableDatesSet = useMemo(() => {
    if (!selectedPractitionerId || !currentService) return new Set<string>();
    return getBookableDates(
      selectedPractitionerId,
      currentService.duration,
      weeklySchedules,
      specificAvailabilities,
      existingBookings,
      new Date(),
      60
    );
  }, [selectedPractitionerId, currentService, weeklySchedules, specificAvailabilities, existingBookings]);

  // Available slots for selected date
  const availableSlots = useMemo(() => {
    if (!selectedPractitionerId || !selectedDate || !currentService) return [];
    return getAvailableSlotsForDate(
      selectedPractitionerId,
      selectedDate,
      currentService.duration,
      weeklySchedules,
      specificAvailabilities,
      existingBookings
    );
  }, [selectedPractitionerId, selectedDate, currentService, weeklySchedules, specificAvailabilities, existingBookings]);

  if (!isOpen) return null;

  // Month navigation helpers
  const handlePrevMonth = () => {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    const now = new Date();
    // Don't navigate to past months
    if (d.getMonth() >= now.getMonth() || d.getFullYear() > now.getFullYear()) {
      setViewDate(d);
    }
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  // Build calendar matrix for viewDate
  const renderCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon ...
    // Adjust for Monday start (0 = Mon, 6 = Sun)
    const startingBlankDays = (firstDayIndex + 6) % 7;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = [];

    // Empty spaces before 1st of month
    for (let i = 0; i < startingBlankDays; i++) {
      daysArray.push(<div key={`blank-${i}`} className="h-10 sm:h-12 w-full" />);
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // Actual month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isPast = dateStr < todayStr;
      const isBookable = !isPast && bookableDatesSet.has(dateStr);
      const isSelected = selectedDate === dateStr;

      daysArray.push(
        <button
          key={dateStr}
          type="button"
          disabled={!isBookable}
          onClick={() => {
            setSelectedDate(dateStr);
            setSelectedSlot(null);
            setStep(4); // proceed to slot selection
          }}
          className={`h-10 sm:h-12 w-full rounded-lg text-xs sm:text-sm font-medium transition-all flex flex-col items-center justify-center relative cursor-pointer ${
            isSelected
              ? 'bg-accent-editorial text-white shadow-xs font-semibold'
              : isBookable
              ? 'border border-line hover:border-accent-editorial text-main bg-card hover:bg-alt'
              : 'text-muted-editorial/30 cursor-not-allowed bg-transparent'
          }`}
          title={isBookable ? 'Available date' : 'Unavailable'}
        >
          <span>{day}</span>
          {isBookable && !isSelected && (
            <span className="w-1 h-1 rounded-full bg-accent-editorial mt-0.5" />
          )}
        </button>
      );
    }

    return daysArray;
  };

  // Submit booking
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentService || !currentPractitioner || !selectedDate || !selectedSlot) {
      setErrorMessage('Please complete all booking selections.');
      return;
    }

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage('Please fill in your name, email, and phone number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const bookingData = {
      serviceId: currentService.id,
      serviceName: currentService.name,
      practitionerId: currentPractitioner.id,
      practitionerName: currentPractitioner.name,
      date: selectedDate,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      duration: currentService.duration,
      price: currentService.price,
      currency: currentService.currency,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      notes: notes.trim(),
    };

    try {
      const bookingResult = await storageService.createBooking(bookingData);

      setIsSubmitting(false);

      if (bookingResult.success && bookingResult.booking) {
        setConfirmedBooking(bookingResult.booking);
        setStep(8); // confirmation view
        if (onBookingSuccess) {
          onBookingSuccess(bookingResult.booking);
        }
      } else {
        setErrorMessage(bookingResult.error || 'This appointment could not be confirmed.');
      }
    } catch (err: any) {
      console.error('Booking Error:', err);
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Booking failed. Please try again.');
    }
  };

  // Generate .ics calendar download
  const handleDownloadIcs = () => {
    if (!confirmedBooking) return;
    const b = confirmedBooking;
    const [startH, startM] = b.startTime.split(':');
    const [endH, endM] = b.endTime.split(':');
    const [y, m, d] = b.date.split('-');

    const dtStart = `${y}${m}${d}T${startH}${startM}00`;
    const dtEnd = `${y}${m}${d}T${endH}${endM}00`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//SHE Academy//Session Booking//EN',
      'BEGIN:VEVENT',
      `UID:${b.id}@she-academy.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${b.serviceName} - SHE. Academy`,
      `DESCRIPTION:Appointment with ${b.practitionerName} (${b.duration} mins). Reference: ${b.id}`,
      'LOCATION:SHE. Academy Studio',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `SHE-Academy-${b.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      id="booking-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div
        id="booking-modal-container"
        className="relative w-full max-w-2xl bg-card border border-line rounded-2xl shadow-xl overflow-hidden transition-all my-8"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-alt/60">
          <div className="flex items-center space-x-2">
            <span className="font-serif text-xl tracking-wide text-main">
              SHE<span className="text-accent-editorial">.</span>
            </span>
            <span className="text-xs uppercase tracking-widest text-muted-editorial font-light">
              Booking Session
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-muted-editorial hover:text-main hover:bg-main transition-colors cursor-pointer"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps Breadcrumbs (when not confirmed) */}
        {step < 8 && (
          <div className="px-6 py-3 border-b border-line bg-main flex items-center justify-between text-xs text-muted-editorial">
            <div className="flex items-center space-x-1.5 sm:space-x-3 overflow-x-auto no-scrollbar">
              <span className={step === 1 ? 'text-accent-editorial font-medium' : ''}>1. Practitioner</span>
              <span>&rsaquo;</span>
              <span className={step === 2 ? 'text-accent-editorial font-medium' : ''}>2. Service</span>
              <span>&rsaquo;</span>
              <span className={step === 3 ? 'text-accent-editorial font-medium' : ''}>3. Date</span>
              <span>&rsaquo;</span>
              <span className={step === 4 || step === 5 ? 'text-accent-editorial font-medium' : ''}>4. Time</span>
              <span>&rsaquo;</span>
              <span className={step === 6 ? 'text-accent-editorial font-medium' : ''}>5. Details</span>
              <span>&rsaquo;</span>
              <span className={step === 7 ? 'text-accent-editorial font-medium' : ''}>6. Confirm</span>
            </div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="text-xs underline hover:text-main cursor-pointer shrink-0 ml-2"
              >
                Back
              </button>
            )}
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Step Content */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {/* STEP 1: Select Practitioner First */}
          {step === 1 && (
            <div className="space-y-4 fade-in">
              <div className="space-y-1">
                <h3 className="font-serif text-2xl text-main font-normal">Select Practitioner</h3>
                <p className="text-xs sm:text-sm text-muted-editorial">
                  Choose your practitioner to view available services and schedule according to their calendar.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-2">
                {practitioners
                  .filter((p) => p.active)
                  .map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedPractitionerId(p.id);
                        setSelectedServiceId('');
                        setSelectedDate('');
                        setSelectedSlot(null);
                        setStep(2); // proceed to service selection
                      }}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center space-x-4 ${
                        selectedPractitionerId === p.id
                          ? 'border-accent-editorial bg-alt text-main shadow-xs'
                          : 'border-line hover:border-main/40 text-main'
                      }`}
                    >
                      <img
                        src={p.photo}
                        alt={p.name}
                        className="w-14 h-14 rounded-full object-cover border border-line shrink-0"
                      />
                      <div className="space-y-0.5">
                        <h4 className="font-serif text-lg text-main font-medium">{p.name}</h4>
                        <p className="text-xs text-accent-editorial">{p.role}</p>
                        <p className="text-[11px] text-muted-editorial line-clamp-1">{p.bio}</p>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* STEP 2: Select Service (Filtered by practitioner) */}
          {step === 2 && (
            <div className="space-y-4 fade-in">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs text-accent-editorial">
                  <span>{currentPractitioner?.name}</span>
                </div>
                <h3 className="font-serif text-2xl text-main font-normal">Select an Offering</h3>
                <p className="text-xs sm:text-sm text-muted-editorial">
                  Choose the session modality offered by {currentPractitioner?.name}.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                {eligibleServices.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => {
                      setSelectedServiceId(service.id);
                      setSelectedDate('');
                      setSelectedSlot(null);
                      setStep(3); // proceed to calendar
                    }}
                    className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      selectedServiceId === service.id
                        ? 'border-accent-editorial bg-alt text-main'
                        : 'border-line hover:border-main/40 text-main'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-sm sm:text-base">{service.name}</h4>
                        <span className="text-[11px] text-muted-editorial px-2 py-0.5 rounded-full bg-main border border-line">
                          {service.duration} min
                        </span>
                      </div>
                      <p className="text-xs text-muted-editorial line-clamp-2">{service.description}</p>
                    </div>
                    <div className="font-serif text-base sm:text-lg font-normal text-accent-editorial shrink-0">
                      {service.currency}
                      {service.price}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Real Calendar (Only dates with availability are selectable!) */}
          {step === 3 && (
            <div className="space-y-5 fade-in">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs text-accent-editorial">
                  <span>{currentPractitioner?.name}</span>
                  <span>&bull;</span>
                  <span>{currentService?.name} ({currentService?.duration} min)</span>
                </div>
                <h3 className="font-serif text-2xl text-main font-normal">Select an Available Date</h3>
                <p className="text-xs text-muted-editorial">
                  Only dates with open working slots are enabled. Fully booked or off-duty days are disabled.
                </p>
              </div>

              {/* Month Navigation */}
              <div className="border border-line rounded-xl p-4 bg-main/50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-sm sm:text-base text-main">
                    {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </h4>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1.5 rounded-lg border border-line text-muted-editorial hover:text-main cursor-pointer"
                      aria-label="Previous month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1.5 rounded-lg border border-line text-muted-editorial hover:text-main cursor-pointer"
                      aria-label="Next month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-wider text-muted-editorial mb-2">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>

                {/* Calendar Days Matrix */}
                <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
              </div>

              <div className="flex items-center space-x-4 text-xs text-muted-editorial pt-1">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent-editorial" />
                  <span>Available date</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-muted-editorial/30" />
                  <span>Fully booked / Off</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 & 5: Exact Available Time Slots */}
          {(step === 4 || step === 5) && (
            <div className="space-y-5 fade-in">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs text-accent-editorial">
                  <span>{currentPractitioner?.name}</span>
                  <span>&bull;</span>
                  <span>{new Date(selectedDate).toLocaleDateString('default', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                </div>
                <h3 className="font-serif text-2xl text-main font-normal">Choose Your Appointment Time</h3>
                <p className="text-xs text-muted-editorial">
                  Exact start times computed for {currentService?.duration} min duration + turnover buffer.
                </p>
              </div>

              {availableSlots.length === 0 ? (
                <div className="p-8 text-center border border-line rounded-xl space-y-3">
                  <p className="text-sm text-muted-editorial">
                    No time slots remain open on this date due to existing bookings or breaks.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-4 py-2 rounded-full border border-line text-xs uppercase tracking-widest text-main hover:bg-alt cursor-pointer"
                  >
                    Select Another Date
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedSlot?.startTime === slot.startTime;
                      return (
                        <button
                          key={slot.startTime}
                          type="button"
                          onClick={() => {
                            setSelectedSlot(slot);
                            setStep(6); // proceed to details
                          }}
                          className={`p-3.5 rounded-xl border text-center font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'border-accent-editorial bg-accent-editorial text-white shadow-xs'
                              : 'border-line bg-main hover:border-accent-editorial text-main hover:bg-alt'
                          }`}
                        >
                          <div className="text-base font-semibold">{slot.startTime}</div>
                          <div className="text-[11px] text-muted-editorial mt-0.5">
                            until {slot.endTime}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="text-xs text-muted-editorial underline hover:text-main cursor-pointer"
                    >
                      &larr; Choose a different date
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 6: Client Details */}
          {step === 6 && (
            <div className="space-y-5 fade-in">
              <div className="space-y-1">
                <h3 className="font-serif text-2xl text-main font-normal">Your Details</h3>
                <p className="text-xs text-muted-editorial">
                  Please provide your contact information for booking confirmation and studio arrival instructions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-editorial font-medium mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Astrid"
                    className="w-full px-4 py-2.5 rounded-xl border border-line bg-main text-main text-sm focus:outline-none focus:border-accent-editorial"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-editorial font-medium mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Larsen"
                    className="w-full px-4 py-2.5 rounded-xl border border-line bg-main text-main text-sm focus:outline-none focus:border-accent-editorial"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-editorial font-medium mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="astrid@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-line bg-main text-main text-sm focus:outline-none focus:border-accent-editorial"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-editorial font-medium mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+45 20 00 00 00"
                    className="w-full px-4 py-2.5 rounded-xl border border-line bg-main text-main text-sm focus:outline-none focus:border-accent-editorial"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-muted-editorial font-medium mb-1">
                    Optional Notes or Inquiries
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any boundaries, physical considerations, or questions for your practitioner..."
                    className="w-full px-4 py-2.5 rounded-xl border border-line bg-main text-main text-sm focus:outline-none focus:border-accent-editorial"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="text-xs text-muted-editorial hover:text-main cursor-pointer"
                >
                  &larr; Back to time slots
                </button>

                <button
                  type="button"
                  disabled={!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()}
                  onClick={() => setStep(7)}
                  className="px-6 py-2.5 rounded-full text-xs uppercase tracking-widest bg-accent-editorial text-white hover:opacity-90 font-medium cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Review Summary &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: Booking Summary & Final Submission */}
          {step === 7 && (
            <div className="space-y-6 fade-in">
              <div className="space-y-1">
                <h3 className="font-serif text-2xl text-main font-normal">Booking Summary</h3>
                <p className="text-xs text-muted-editorial">
                  Please review your appointment details before final confirmation.
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-5 rounded-2xl border border-line bg-alt/50 space-y-4">
                <div className="flex items-center space-x-4 border-b border-line pb-4">
                  <img
                    src={currentPractitioner?.photo}
                    alt={currentPractitioner?.name}
                    className="w-14 h-14 rounded-full object-cover border border-line"
                  />
                  <div>
                    <h4 className="font-serif text-lg text-main font-medium">{currentPractitioner?.name}</h4>
                    <p className="text-xs text-accent-editorial">{currentPractitioner?.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-editorial uppercase tracking-wider block mb-0.5">Session</span>
                    <span className="font-medium text-main text-sm">{currentService?.name}</span>
                  </div>

                  <div>
                    <span className="text-muted-editorial uppercase tracking-wider block mb-0.5">Investment</span>
                    <span className="font-medium text-main text-sm">
                      {currentService?.currency}
                      {currentService?.price}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-editorial uppercase tracking-wider block mb-0.5">Date</span>
                    <span className="font-medium text-main text-sm">
                      {new Date(selectedDate).toLocaleDateString('default', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-editorial uppercase tracking-wider block mb-0.5">Time & Duration</span>
                    <span className="font-medium text-main text-sm">
                      {selectedSlot?.startTime} – {selectedSlot?.endTime} ({currentService?.duration} min)
                    </span>
                  </div>

                  <div className="col-span-2 pt-2 border-t border-line">
                    <span className="text-muted-editorial uppercase tracking-wider block mb-0.5">Client</span>
                    <span className="text-main">
                      {firstName} {lastName} &bull; {email} &bull; {phone}
                    </span>
                    {notes && <p className="text-muted-editorial italic mt-1">"{notes}"</p>}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(6)}
                  className="text-xs text-muted-editorial hover:text-main cursor-pointer"
                >
                  &larr; Edit Details
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleBookingSubmit}
                  className="px-8 py-3 rounded-full text-xs uppercase tracking-widest font-semibold bg-accent-editorial text-white hover:opacity-90 transition-all cursor-pointer shadow-xs disabled:opacity-60 flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <span>Confirming...</span>
                  ) : (
                    <>
                      <span>Confirm & Book Session</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 8: Confirmation Screen */}
          {step === 8 && confirmedBooking && (
            <div className="text-center space-y-6 py-4 fade-in">
              <div className="w-16 h-16 rounded-full bg-accent-editorial/15 text-accent-editorial flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-3xl text-main font-normal">Session Confirmed</h3>
                <p className="text-sm text-muted-editorial max-w-md mx-auto">
                  Your appointment with {confirmedBooking.practitionerName} has been secured. A confirmation email has
                  been dispatched to <strong className="text-main">{confirmedBooking.email}</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-line bg-alt/40 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-line py-2">
                  <span className="text-muted-editorial">Reference ID:</span>
                  <span className="font-mono font-medium text-accent-editorial">{confirmedBooking.id}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-muted-editorial">Service:</span>
                  <span className="font-medium text-main">{confirmedBooking.serviceName}</span>
                </div>
                <div className="flex justify-between border-b border-line pb-2">
                  <span className="text-muted-editorial">Date & Time:</span>
                  <span className="font-medium text-main">
                    {confirmedBooking.date} at {confirmedBooking.startTime} ({confirmedBooking.duration} min)
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-muted-editorial">Price:</span>
                  <span className="font-medium text-main">
                    {confirmedBooking.currency}
                    {confirmedBooking.price}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadIcs}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-line text-xs uppercase tracking-widest text-main hover:bg-alt cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Add to Calendar (.ics)</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-8 py-2.5 rounded-full bg-accent-editorial text-white text-xs uppercase tracking-widest font-medium hover:opacity-90 cursor-pointer shadow-xs"
                >
                  Close & Return
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
