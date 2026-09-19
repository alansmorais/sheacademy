import { DaySchedule, SpecificAvailability, Booking } from '../types';

export function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export function minutesToTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function isOverlapping(startA: number, endA: number, startB: number, endB: number): boolean {
  return Math.max(startA, startB) < Math.min(endA, endB);
}

export interface SlotOption {
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  available: boolean;
}

/**
 * Calculates exact available time slots for a practitioner on a specific date,
 * strictly accounting for:
 * - Weekly schedule for the date's day-of-week
 * - Specific availability overrides (TIME_OFF, BLOCKED, or AVAILABLE extra periods)
 * - Existing bookings (excluding Cancelled)
 * - Service duration (slot must fully fit before the shift or break ends)
 * - Clean buffer between bookings (default 15 minutes)
 */
export function getAvailableSlotsForDate(
  practitionerId: string,
  dateString: string, // YYYY-MM-DD
  serviceDurationMinutes: number,
  weeklySchedules: Record<string, DaySchedule[]>,
  specificAvailabilities: SpecificAvailability[],
  existingBookings: Booking[],
  bufferMinutes: number = 15
): SlotOption[] {
  // Parse date
  const [year, month, day] = dateString.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const dayOfWeek = dateObj.getDay(); // 0 = Sun, 1 = Mon ...

  // Check specific overrides for this practitioner on this date
  const specificForDate = specificAvailabilities.filter(
    (sa) => sa.practitionerId === practitionerId && sa.date === dateString
  );

  // Check if entire day is marked as TIME_OFF or full day BLOCKED
  const fullDayOff = specificForDate.some(
    (sa) =>
      sa.type === 'TIME_OFF' &&
      (!sa.startTime || !sa.endTime || (sa.startTime <= '09:00' && sa.endTime >= '18:00'))
  );
  if (fullDayOff) {
    return [];
  }

  // Determine working windows for this day
  let workingWindows: { start: number; end: number }[] = [];

  const practitionerSchedule = weeklySchedules[practitionerId] || [];
  const daySchedule = practitionerSchedule.find((d) => d.dayOfWeek === dayOfWeek);

  if (daySchedule && !daySchedule.isOff && daySchedule.slots.length > 0) {
    workingWindows = daySchedule.slots.map((s) => ({
      start: timeToMinutes(s.start),
      end: timeToMinutes(s.end),
    }));
  }

  // Any specific extra AVAILABLE windows added for this date?
  const extraAvailable = specificForDate.filter((sa) => sa.type === 'AVAILABLE');
  for (const extra of extraAvailable) {
    workingWindows.push({
      start: timeToMinutes(extra.startTime),
      end: timeToMinutes(extra.endTime),
    });
  }

  if (workingWindows.length === 0) {
    return [];
  }

  // Blocked time intervals on this date (from BLOCKED specific availability or partial TIME_OFF)
  const blockedWindows = specificForDate
    .filter((sa) => sa.type === 'BLOCKED' || (sa.type === 'TIME_OFF' && sa.startTime && sa.endTime))
    .map((sa) => ({
      start: timeToMinutes(sa.startTime),
      end: timeToMinutes(sa.endTime),
    }));

  // Existing active bookings on this date for this practitioner
  const bookingsOnDate = existingBookings
    .filter(
      (b) =>
        b.practitionerId === practitionerId &&
        b.date === dateString &&
        b.status !== 'Cancelled'
    )
    .map((b) => ({
      start: timeToMinutes(b.startTime),
      // include buffer at the end of booking
      end: timeToMinutes(b.endTime) + bufferMinutes,
    }));

  const busyIntervals = [...blockedWindows, ...bookingsOnDate];

  const candidateSlots: SlotOption[] = [];
  // Slot step increment: 30 minutes for flexibility
  const stepIncrement = 30;

  for (const window of workingWindows) {
    let currentStart = window.start;
    while (currentStart + serviceDurationMinutes <= window.end) {
      const currentEnd = currentStart + serviceDurationMinutes;

      // Check if [currentStart, currentEnd] overlaps with ANY busy interval
      const hasConflict = busyIntervals.some((busy) =>
        isOverlapping(currentStart, currentEnd, busy.start, busy.end)
      );

      if (!hasConflict) {
        candidateSlots.push({
          startTime: minutesToTime(currentStart),
          endTime: minutesToTime(currentEnd),
          available: true,
        });
      }

      currentStart += stepIncrement;
    }
  }

  // Filter unique start times in ascending order
  const seen = new Set<string>();
  const uniqueSlots: SlotOption[] = [];
  for (const slot of candidateSlots) {
    if (!seen.has(slot.startTime)) {
      seen.add(slot.startTime);
      uniqueSlots.push(slot);
    }
  }

  return uniqueSlots.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
}

/**
 * Determines which dates in a range (e.g. next 60 days) actually have at least 1 available slot.
 * Returns a Set of date strings 'YYYY-MM-DD' that are bookable.
 */
export function getBookableDates(
  practitionerId: string,
  serviceDurationMinutes: number,
  weeklySchedules: Record<string, DaySchedule[]>,
  specificAvailabilities: SpecificAvailability[],
  existingBookings: Booking[],
  startDate: Date = new Date(),
  daysForward: number = 60
): Set<string> {
  const bookable = new Set<string>();

  for (let i = 0; i < daysForward; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];

    const slots = getAvailableSlotsForDate(
      practitionerId,
      dateStr,
      serviceDurationMinutes,
      weeklySchedules,
      specificAvailabilities,
      existingBookings
    );

    if (slots.length > 0) {
      bookable.add(dateStr);
    }
  }

  return bookable;
}

/**
 * Validates booking submission to prevent race conditions or double bookings.
 */
export function validateBookingConflict(
  practitionerId: string,
  date: string,
  startTime: string,
  durationMinutes: number,
  existingBookings: Booking[],
  specificAvailabilities: SpecificAvailability[],
  weeklySchedules: Record<string, DaySchedule[]>
): { valid: boolean; reason?: string } {
  const startMin = timeToMinutes(startTime);
  const endMin = startMin + durationMinutes;

  // 1. Check existing bookings
  const conflictingBooking = existingBookings.find((b) => {
    if (b.practitionerId !== practitionerId || b.date !== date || b.status === 'Cancelled') {
      return false;
    }
    const bStart = timeToMinutes(b.startTime);
    const bEnd = timeToMinutes(b.endTime);
    return isOverlapping(startMin, endMin, bStart, bEnd);
  });

  if (conflictingBooking) {
    return {
      valid: false,
      reason: `This appointment slot conflicts with an existing booking (${conflictingBooking.startTime} - ${conflictingBooking.endTime}). Please select another time.`,
    };
  }

  // 2. Check blocked / time-off dates
  const conflictingBlock = specificAvailabilities.find((sa) => {
    if (sa.practitionerId !== practitionerId || sa.date !== date) return false;
    if (sa.type === 'TIME_OFF' || sa.type === 'BLOCKED') {
      if (!sa.startTime || !sa.endTime) return true; // full day
      const sStart = timeToMinutes(sa.startTime);
      const sEnd = timeToMinutes(sa.endTime);
      return isOverlapping(startMin, endMin, sStart, sEnd);
    }
    return false;
  });

  if (conflictingBlock) {
    return {
      valid: false,
      reason: `Practitioner has blocked or scheduled time off during this period.`,
    };
  }

  return { valid: true };
}
