import React, { useState, useMemo, useEffect } from 'react';
import {
  Practitioner,
  Service,
  DaySchedule,
  SpecificAvailability,
  Booking,
  ClientRecord,
  AdminSettings,
  BookingStatus,
  UserSession,
  Workshop,
} from '../types';
import { storageService } from '../services/storageService';
import {
  Calendar as CalendarIcon,
  Users,
  Briefcase,
  Clock,
  Settings as SettingsIcon,
  BarChart3,
  BookOpen,
  Lock,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertCircle,
  Copy,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  Shield,
  HelpCircle,
  Key,
  Eye,
  EyeOff,
  Compass,
  Activity,
  RefreshCw,
  Code2,
} from 'lucide-react';

interface AdminDashboardProps {
  practitioners: Practitioner[];
  services: Service[];
  workshops?: Workshop[];
  weeklySchedules: Record<string, DaySchedule[]>;
  specificAvailabilities: SpecificAvailability[];
  bookings: Booking[];
  settings: AdminSettings;
  onRefreshData: () => void;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  practitioners,
  services,
  workshops,
  weeklySchedules,
  specificAvailabilities,
  bookings,
  settings,
  onRefreshData,
  onClose,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    storageService.isAdminAuthenticated()
  );
  const [currentSession, setCurrentSession] = useState<UserSession | null>(() =>
    storageService.getCurrentSession()
  );
  const [selectedAccountId, setSelectedAccountId] = useState<string>('admin');
  const [authPassword, setAuthPassword] = useState('');
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Password Change Modal State
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [changePassError, setChangePassError] = useState<string | null>(null);
  const [changePassSuccess, setChangePassSuccess] = useState<string | null>(null);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'calendar' | 'bookings' | 'practitioners' | 'services' | 'workshops' | 'availability' | 'clients' | 'settings'
  >('dashboard');

  // Workshops State (Full Sanctuary Access / Administrator)
  const [workshopsList, setWorkshopsList] = useState<Workshop[]>(() => workshops || storageService.getWorkshops());
  const [editingWorkshop, setEditingWorkshop] = useState<Partial<Workshop> | null>(null);
  const [workshopCurriculumInput, setWorkshopCurriculumInput] = useState<string>('');

  // Keep workshops synced with prop if updated
  React.useEffect(() => {
    if (workshops) {
      setWorkshopsList(workshops);
    } else {
      setWorkshopsList(storageService.getWorkshops());
    }
  }, [workshops]);

  const handleSaveWorkshop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorkshop || !editingWorkshop.title) return;

    const curriculumArray = workshopCurriculumInput
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const workshopData: Workshop = {
      id: editingWorkshop.id || `ws-${Date.now()}`,
      title: editingWorkshop.title || 'Untitled Workshop',
      subtitle: editingWorkshop.subtitle || '',
      date: editingWorkshop.date || 'Upcoming',
      time: editingWorkshop.time || '10:00 – 17:00',
      location: editingWorkshop.location || 'SHE. Academy Sanctuary, Copenhagen',
      facilitators:
        editingWorkshop.facilitators && editingWorkshop.facilitators.length > 0
          ? editingWorkshop.facilitators
          : ['Mgr. Daniela Torp'],
      capacity: Number(editingWorkshop.capacity) || 12,
      spotsLeft: Number(editingWorkshop.spotsLeft) ?? Number(editingWorkshop.capacity) ?? 12,
      price: Number(editingWorkshop.price) || 3500,
      currency: editingWorkshop.currency || 'kr',
      description: editingWorkshop.description || '',
      curriculum: curriculumArray,
      image:
        editingWorkshop.image ||
        'https://raw.githubusercontent.com/alansmorais/she/main/images/for-women-seated.jpg',
    };

    if (editingWorkshop.id) {
      storageService.updateWorkshop(editingWorkshop.id, workshopData);
    } else {
      storageService.addWorkshop(workshopData);
    }

    setWorkshopsList(storageService.getWorkshops());
    setEditingWorkshop(null);
    onRefreshData();
  };

  const handleDeleteWorkshop = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove the workshop "${title}"?`)) {
      storageService.deleteWorkshop(id);
      setWorkshopsList(storageService.getWorkshops());
      onRefreshData();
    }
  };

  // Calendar View Mode: Month, Week, Day
  const [calendarViewMode, setCalendarViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [calendarPractitionerFilter, setCalendarPractitionerFilter] = useState<string>(() => {
    const s = storageService.getCurrentSession();
    return s?.role === 'practitioner' && s.practitionerId ? s.practitionerId : 'all';
  });

  // Selected Booking Detail Modal
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<Booking | null>(null);

  // Bookings List Filters
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');
  const [bookingPractitionerFilter, setBookingPractitionerFilter] = useState<string>(() => {
    const s = storageService.getCurrentSession();
    return s?.role === 'practitioner' && s.practitionerId ? s.practitionerId : 'all';
  });

  // Practitioner Form Modal
  const [editingPractitioner, setEditingPractitioner] = useState<Partial<Practitioner> | null>(null);

  // Service Form Modal
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);

  // Availability Manager State
  const [availPractitionerId, setAvailPractitionerId] = useState<string>(() => {
    const s = storageService.getCurrentSession();
    return s?.role === 'practitioner' && s.practitionerId ? s.practitionerId : 'daniela';
  });
  const [newSpecificDate, setNewSpecificDate] = useState<string>('');
  const [newSpecificType, setNewSpecificType] = useState<'AVAILABLE' | 'BLOCKED' | 'TIME_OFF'>('TIME_OFF');
  const [newSpecificStart, setNewSpecificStart] = useState<string>('09:00');
  const [newSpecificEnd, setNewSpecificEnd] = useState<string>('17:00');
  const [newSpecificNotes, setNewSpecificNotes] = useState<string>('');

  // Settings State
  const [tempGoogleUrl, setTempGoogleUrl] = useState(settings.googleScriptUrl || '');
  const [tempAdminEmail, setTempAdminEmail] = useState(settings.adminEmail || 'info@she-academy.com');
  const [devPasswordInput, setDevPasswordInput] = useState('');
  const [isDevAuthenticated, setIsDevAuthenticated] = useState(false);
  const [backendCode, setBackendCode] = useState<string | null>(null);
  const [isCopyingBackendCode, setIsCopyingBackendCode] = useState(false);
  const [tempStripeKey, setTempStripeKey] = useState('');
  const [stripeStatus, setStripeStatus] = useState<any>(null);
  const [isCheckingStripe, setIsCheckingStripe] = useState(false);
  const [settingsSavedNotice, setSettingsSavedNotice] = useState(false);
  const [copiedCodeNotice, setCopiedCodeNotice] = useState(false);
  const [adminResetPassSuccess, setAdminResetPassSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isDevAuthenticated && !backendCode) {
      fetch('/api/backend-code')
        .then(res => res.json())
        .then(data => setBackendCode(data.code))
        .catch(err => console.error('Failed to fetch backend code:', err));
    }
  }, [isDevAuthenticated, backendCode]);

  // Handle Stripe Diagnostics
  const checkStripe = async () => {
    setIsCheckingStripe(true);
    setStripeStatus(null);
    try {
      const url = tempStripeKey 
        ? `/api/stripe/diagnostics?testKey=${encodeURIComponent(tempStripeKey)}` 
        : '/api/stripe/diagnostics';
      const res = await fetch(url);
      const data = await res.json();
      setStripeStatus(data);
    } catch (err) {
      setStripeStatus({ connection: 'FAILED', error: 'Network error' });
    } finally {
      setIsCheckingStripe(false);
    }
  };

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = storageService.loginUser(selectedAccountId, authPassword);
    if (result.success && result.session) {
      setIsAuthenticated(true);
      setCurrentSession(result.session);
      setAuthError(null);
      setAuthPassword('');

      // If practitioner, automatically focus on their calendar & schedule
      if (result.session.role === 'practitioner' && result.session.practitionerId) {
        setCalendarPractitionerFilter(result.session.practitionerId);
        setBookingPractitionerFilter(result.session.practitionerId);
        setAvailPractitionerId(result.session.practitionerId);
        setActiveTab('calendar');
        if (result.session.isFirstAccess) {
          setIsChangePasswordOpen(true);
        }
      }
    } else {
      setAuthError(result.error || 'Invalid credentials. Please check your password and try again.');
    }
  };

  const handleLogout = () => {
    storageService.logoutAdmin();
    setIsAuthenticated(false);
    setCurrentSession(null);
  };

  // Password Change Handler
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePassError(null);
    setChangePassSuccess(null);

    if (newPassInput.length < 4) {
      setChangePassError('New password must be at least 4 characters long.');
      return;
    }
    if (newPassInput !== confirmPassInput) {
      setChangePassError('New passwords do not match.');
      return;
    }

    if (currentSession?.role === 'practitioner' && currentSession.practitionerId) {
      const activePass = storageService.getPractitionerPassword(currentSession.practitionerId);
      if (currentPassInput !== activePass) {
        setChangePassError('Current password is incorrect.');
        return;
      }
      storageService.setPractitionerPassword(currentSession.practitionerId, newPassInput);
      setChangePassSuccess('Password successfully updated! Your new password will be required for future logins.');
      setCurrentSession({ ...currentSession, isFirstAccess: false });
      setTimeout(() => {
        setIsChangePasswordOpen(false);
        setCurrentPassInput('');
        setNewPassInput('');
        setConfirmPassInput('');
        setChangePassSuccess(null);
      }, 1500);
    } else if (currentSession?.role === 'admin') {
      const activePass = storageService.getAdminPassword();
      if (currentPassInput !== activePass) {
        setChangePassError('Current password is incorrect.');
        return;
      }
      storageService.setAdminPassword(newPassInput);
      setChangePassSuccess('Administrator password updated successfully.');
      setTimeout(() => {
        setIsChangePasswordOpen(false);
        setCurrentPassInput('');
        setNewPassInput('');
        setConfirmPassInput('');
        setChangePassSuccess(null);
      }, 1500);
    }
  };

  // Dashboard Metrics (filtered to practitioner's sessions if practitioner is logged in)
  const activeBookings = useMemo(() => {
    if (currentSession?.role === 'practitioner' && currentSession.practitionerId) {
      return bookings.filter((b) => b.practitionerId === currentSession.practitionerId);
    }
    return bookings;
  }, [bookings, currentSession]);

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysAppointments = activeBookings.filter((b) => b.date === todayStr && b.status !== 'Cancelled');
  const upcomingAppointments = activeBookings
    .filter((b) => b.date >= todayStr && b.status !== 'Cancelled')
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));
  const pendingRequests = activeBookings.filter((b) => b.status === 'Pending');
  const confirmedCount = activeBookings.filter((b) => b.status === 'Confirmed').length;

  // Clients Directory
  const clientsList = useMemo(() => storageService.getClients(), [bookings]);

  // Update Booking Status Handler
  const handleStatusChange = (bookingId: string, status: BookingStatus) => {
    storageService.updateBookingStatus(bookingId, status);
    onRefreshData();
    if (selectedBookingDetail && selectedBookingDetail.id === bookingId) {
      setSelectedBookingDetail({ ...selectedBookingDetail, status });
    }
  };

  // Availability Management Handlers
  const handleToggleDayOff = (dayOfWeek: number) => {
    const currentScheds = { ...weeklySchedules };
    const pSchedule = [...(currentScheds[availPractitionerId] || [])];
    const dayIdx = pSchedule.findIndex((d) => d.dayOfWeek === dayOfWeek);
    if (dayIdx >= 0) {
      pSchedule[dayIdx] = {
        ...pSchedule[dayIdx],
        isOff: !pSchedule[dayIdx].isOff,
      };
      currentScheds[availPractitionerId] = pSchedule;
      storageService.saveWeeklySchedules(currentScheds);
      onRefreshData();
    }
  };

  const handleAddWeeklySlot = (dayOfWeek: number) => {
    const currentScheds = { ...weeklySchedules };
    const pSchedule = [...(currentScheds[availPractitionerId] || [])];
    const dayIdx = pSchedule.findIndex((d) => d.dayOfWeek === dayOfWeek);
    if (dayIdx >= 0) {
      pSchedule[dayIdx] = {
        ...pSchedule[dayIdx],
        isOff: false,
        slots: [...pSchedule[dayIdx].slots, { start: '14:00', end: '18:00' }],
      };
      currentScheds[availPractitionerId] = pSchedule;
      storageService.saveWeeklySchedules(currentScheds);
      onRefreshData();
    }
  };

  const handleUpdateWeeklySlot = (dayOfWeek: number, slotIdx: number, field: 'start' | 'end', val: string) => {
    const currentScheds = { ...weeklySchedules };
    const pSchedule = [...(currentScheds[availPractitionerId] || [])];
    const dayIdx = pSchedule.findIndex((d) => d.dayOfWeek === dayOfWeek);
    if (dayIdx >= 0 && pSchedule[dayIdx].slots[slotIdx]) {
      const updatedSlots = [...pSchedule[dayIdx].slots];
      updatedSlots[slotIdx] = { ...updatedSlots[slotIdx], [field]: val };
      pSchedule[dayIdx] = { ...pSchedule[dayIdx], slots: updatedSlots };
      currentScheds[availPractitionerId] = pSchedule;
      storageService.saveWeeklySchedules(currentScheds);
      onRefreshData();
    }
  };

  const handleDeleteWeeklySlot = (dayOfWeek: number, slotIdx: number) => {
    const currentScheds = { ...weeklySchedules };
    const pSchedule = [...(currentScheds[availPractitionerId] || [])];
    const dayIdx = pSchedule.findIndex((d) => d.dayOfWeek === dayOfWeek);
    if (dayIdx >= 0) {
      const updatedSlots = pSchedule[dayIdx].slots.filter((_, idx) => idx !== slotIdx);
      pSchedule[dayIdx] = {
        ...pSchedule[dayIdx],
        slots: updatedSlots,
        isOff: updatedSlots.length === 0,
      };
      currentScheds[availPractitionerId] = pSchedule;
      storageService.saveWeeklySchedules(currentScheds);
      onRefreshData();
    }
  };

  const handleAddSpecificOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpecificDate) return;
    const currentOverrides = [...specificAvailabilities];
    const newOverride: SpecificAvailability = {
      id: `spec-${Date.now()}`,
      practitionerId: availPractitionerId,
      date: newSpecificDate,
      startTime: newSpecificStart,
      endTime: newSpecificEnd,
      type: newSpecificType,
      notes: newSpecificNotes.trim(),
    };
    currentOverrides.push(newOverride);
    storageService.saveSpecificAvailabilities(currentOverrides);
    setNewSpecificNotes('');
    setNewSpecificDate('');
    onRefreshData();
  };

  const handleDeleteSpecificOverride = (id: string) => {
    const currentOverrides = specificAvailabilities.filter((sa) => sa.id !== id);
    storageService.saveSpecificAvailabilities(currentOverrides);
    onRefreshData();
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveSettings({
      ...settings,
      googleScriptUrl: tempGoogleUrl.trim(),
      adminEmail: tempAdminEmail.trim(),
      lastSynced: new Date().toISOString(),
    });
    onRefreshData();
    setSettingsSavedNotice(true);
    setTimeout(() => setSettingsSavedNotice(false), 3000);
  };

  // Save Practitioner (Add / Edit)
  const handleSavePractitioner = (p: Partial<Practitioner>) => {
    const currentList = [...practitioners];
    if (p.id) {
      const idx = currentList.findIndex((item) => item.id === p.id);
      if (idx >= 0) {
        currentList[idx] = { ...currentList[idx], ...p } as Practitioner;
      }
    } else {
      const newP: Practitioner = {
        id: `practitioner-${Date.now()}`,
        name: p.name || 'New Practitioner',
        role: p.role || 'Practitioner',
        bio: p.bio || '',
        photo: p.photo || 'https://raw.githubusercontent.com/alansmorais/she/main/images/daniela.jpg',
        services: p.services || ['individual-consultation'],
        active: p.active !== undefined ? p.active : true,
        gender: p.gender || 'female',
        email: p.email || 'practitioner@she-academy.com',
        phone: p.phone || '',
      };
      currentList.push(newP);
    }
    storageService.savePractitioners(currentList);
    setEditingPractitioner(null);
    onRefreshData();
  };

  // Save Service (Add / Edit)
  const handleSaveService = (s: Partial<Service>) => {
    const currentList = [...services];
    if (s.id) {
      const idx = currentList.findIndex((item) => item.id === s.id);
      if (idx >= 0) {
        currentList[idx] = { ...currentList[idx], ...s } as Service;
      }
    } else {
      const newS: Service = {
        id: `srv-${Date.now()}`,
        name: s.name || 'New Session Offering',
        category: s.category || 'general',
        description: s.description || '',
        duration: Number(s.duration) || 60,
        price: Number(s.price) || 120,
        currency: s.currency || '€',
        eligiblePractitioners: s.eligiblePractitioners || ['daniela'],
        active: s.active !== undefined ? s.active : true,
      };
      currentList.push(newS);
    }
    storageService.saveServices(currentList);
    setEditingService(null);
    onRefreshData();
  };

  // Render Authentication Gate if not authenticated
  if (!isAuthenticated) {
    return (
      <div
        id="admin-auth-gate"
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md bg-card border border-line rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-accent-editorial/15 text-accent-editorial flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-3xl text-main font-normal">Sanctuary Access</h2>
            <p className="text-xs text-muted-editorial">
              Calendar, Availability & Appointment Management Portal
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-editorial font-medium mb-1.5">
                Select Account / Practitioner
              </label>
              <select
                value={selectedAccountId}
                onChange={(e) => {
                  setSelectedAccountId(e.target.value);
                  setAuthError(null);
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-line bg-main text-main text-xs font-medium focus:outline-none focus:border-accent-editorial cursor-pointer"
              >
                <option value="admin">Administrator (Full Sanctuary Access)</option>
                <optgroup label="Practitioners">
                  {practitioners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.role.split('•')[0].trim()})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs uppercase tracking-widest text-muted-editorial font-medium">
                  {selectedAccountId === 'admin' ? 'Administrator Password' : 'Practitioner Password'}
                </label>
                <button
                  type="button"
                  onClick={() => setShowAuthPassword(!showAuthPassword)}
                  className="text-[11px] text-muted-editorial hover:text-main flex items-center space-x-1 cursor-pointer"
                >
                  {showAuthPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showAuthPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type={showAuthPassword ? 'text' : 'password'}
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-2.5 rounded-xl border border-line bg-main text-main text-sm focus:outline-none focus:border-accent-editorial pr-10"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-editorial pointer-events-none">
                  <Key className="w-4 h-4" />
                </div>
              </div>

              {selectedAccountId !== 'admin' && (
                <p className="mt-2 text-[11px] text-muted-editorial leading-relaxed">
                  First-time access? Sign in using the standard initial password, then set your personal password to administer your own calendar.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full text-xs uppercase tracking-widest font-semibold bg-accent-editorial text-white hover:opacity-90 shadow-xs cursor-pointer transition-all"
            >
              {selectedAccountId === 'admin' ? 'Sign In as Administrator' : 'Sign In to My Calendar'}
            </button>
          </form>

          <div className="pt-3 border-t border-line text-center flex items-center justify-between text-xs text-muted-editorial">
            <span className="text-[11px]">
              {selectedAccountId === 'admin' ? 'Master Admin Access' : 'Private Practitioner Calendar'}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="hover:text-main underline cursor-pointer"
            >
              Return to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Day of week labels
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div id="admin-portal" className="min-h-screen bg-main text-main transition-colors">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-line bg-header backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="flex items-baseline space-x-1.5 text-left cursor-pointer group"
          >
            <span className="font-serif text-2xl font-light tracking-wider text-main">
              SHE<span className="text-accent-editorial">.</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-alt border border-line font-medium text-accent-editorial">
              {currentSession?.role === 'practitioner' ? 'Practitioner Portal' : 'Admin'}
            </span>
          </button>
        </div>

        {/* Tab switcher */}
        <div className="hidden md:flex items-center space-x-1 text-xs tracking-wide">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
            { id: 'bookings', label: 'Bookings', icon: BookOpen },
            ...(currentSession?.role !== 'practitioner'
              ? [
                  { id: 'practitioners', label: 'Practitioners', icon: Users },
                  { id: 'services', label: 'Services', icon: Briefcase },
                  { id: 'workshops', label: 'Workshops', icon: Compass },
                ]
              : []),
            { id: 'availability', label: 'Availability', icon: Clock },
            { id: 'clients', label: 'Clients', icon: Users },
            { id: 'settings', label: 'Settings & Security', icon: SettingsIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-full flex items-center space-x-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-accent-editorial text-white shadow-xs font-medium'
                    : 'text-muted-editorial hover:text-main hover:bg-alt'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* User profile & actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-alt border border-line text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-muted-editorial hidden sm:inline text-[11px] uppercase tracking-wider">
              {currentSession?.role === 'practitioner' ? 'Practitioner:' : 'Role:'}
            </span>
            <span className="font-semibold text-main text-xs max-w-[120px] truncate">
              {currentSession?.name || 'Administrator'}
            </span>
            <button
              type="button"
              onClick={() => {
                setChangePassError(null);
                setChangePassSuccess(null);
                setCurrentPassInput('');
                setNewPassInput('');
                setConfirmPassInput('');
                setIsChangePasswordOpen(true);
              }}
              className="ml-1 text-accent-editorial hover:underline text-[11px] flex items-center space-x-1 cursor-pointer"
              title="Change Password"
            >
              <Key className="w-3 h-3" />
              <span className="hidden lg:inline">Password</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xs uppercase tracking-widest text-muted-editorial hover:text-main px-3 py-1.5 rounded-full border border-line cursor-pointer hidden sm:block"
          >
            Live Site
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 rounded-full text-muted-editorial hover:text-main border border-line cursor-pointer"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Tab Scrollbar */}
      <div className="md:hidden border-b border-line bg-alt/50 px-4 py-2 flex space-x-2 overflow-x-auto no-scrollbar text-xs">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'calendar', label: 'Calendar' },
          { id: 'bookings', label: 'Bookings' },
          ...(currentSession?.role !== 'practitioner'
            ? [
                { id: 'practitioners', label: 'Practitioners' },
                { id: 'services', label: 'Services' },
                { id: 'workshops', label: 'Workshops' },
              ]
            : []),
          { id: 'availability', label: 'Availability' },
          { id: 'clients', label: 'Clients' },
          { id: 'settings', label: 'Settings' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-accent-editorial text-white font-medium'
                : 'text-muted-editorial hover:text-main'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* First-Time Standard Password Alert Banner */}
        {currentSession?.isFirstAccess && (
          <div className="p-4 sm:p-5 rounded-2xl border border-accent-editorial/30 bg-accent-editorial/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center space-x-3">
              <div className="p-2.5 rounded-full bg-accent-editorial text-white shrink-0 mt-0.5 sm:mt-0">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-main">
                  {currentSession.role === 'practitioner'
                    ? `Initial Standard Password in Use — ${currentSession.name}`
                    : 'Initial Standard Password in Use'}
                </p>
                <p className="text-xs text-muted-editorial mt-0.5">
                  {currentSession.role === 'practitioner'
                    ? 'You have signed in using the standard initial access password. Please set your private password below to administer your own calendar and bookings securely.'
                    : 'You have signed in using the standard initial password. Please update your administrator password.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setChangePassError(null);
                setChangePassSuccess(null);
                setCurrentPassInput('');
                setNewPassInput('');
                setConfirmPassInput('');
                setIsChangePasswordOpen(true);
              }}
              className="px-5 py-2 rounded-full bg-accent-editorial text-white text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer shrink-0 shadow-xs"
            >
              Set Private Password
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 1. DASHBOARD TAB */}
        {/* ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 fade-in">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl border border-line bg-card shadow-xs space-y-2">
                <span className="text-xs uppercase tracking-widest text-muted-editorial">Today's Sessions</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-4xl text-main font-normal">{todaysAppointments.length}</span>
                  <span className="text-xs text-accent-editorial font-medium">Active</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-line bg-card shadow-xs space-y-2">
                <span className="text-xs uppercase tracking-widest text-muted-editorial">Pending Requests</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-4xl text-amber-600 dark:text-amber-400 font-normal">
                    {pendingRequests.length}
                  </span>
                  <span className="text-xs text-muted-editorial">Awaiting Review</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-line bg-card shadow-xs space-y-2">
                <span className="text-xs uppercase tracking-widest text-muted-editorial">Confirmed Bookings</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-4xl text-emerald-600 dark:text-emerald-400 font-normal">
                    {confirmedCount}
                  </span>
                  <span className="text-xs text-muted-editorial">Total on File</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-line bg-card shadow-xs space-y-2">
                <span className="text-xs uppercase tracking-widest text-muted-editorial">Active Practitioners</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-4xl text-main font-normal">
                    {practitioners.filter((p) => p.active).length}
                  </span>
                  <span className="text-xs text-muted-editorial">of {practitioners.length} total</span>
                </div>
              </div>
            </div>

            {/* Upcoming Appointments Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl text-main font-normal">Upcoming Sessions</h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs uppercase tracking-widest text-accent-editorial hover:underline cursor-pointer"
                >
                  View All Bookings &rarr;
                </button>
              </div>

              <div className="border border-line rounded-2xl overflow-hidden bg-card shadow-xs">
                {upcomingAppointments.length === 0 ? (
                  <div className="p-8 text-center text-muted-editorial text-sm">
                    No upcoming sessions scheduled.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-line bg-alt/60 text-muted-editorial uppercase tracking-wider">
                        <tr>
                          <th className="p-4">Ref ID</th>
                          <th className="p-4">Date & Time</th>
                          <th className="p-4">Client</th>
                          <th className="p-4">Practitioner</th>
                          <th className="p-4">Service</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line">
                        {upcomingAppointments.slice(0, 6).map((b) => (
                          <tr key={b.id} className="hover:bg-alt/30 transition-colors">
                            <td className="p-4 font-mono font-medium text-accent-editorial">{b.id}</td>
                            <td className="p-4 text-main font-medium">
                              {b.date} at {b.startTime}
                            </td>
                            <td className="p-4">
                              <div className="font-medium text-main">{b.firstName} {b.lastName}</div>
                              <div className="text-[11px] text-muted-editorial">{b.email}</div>
                            </td>
                            <td className="p-4 text-main">{b.practitionerName}</td>
                            <td className="p-4 text-muted-editorial">
                              {b.serviceName} ({b.duration} min)
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                                  b.status === 'Confirmed'
                                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                                    : b.status === 'Pending'
                                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                                    : 'bg-muted-editorial/20 text-muted-editorial'
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                type="button"
                                onClick={() => setSelectedBookingDetail(b)}
                                className="px-3 py-1 rounded-full border border-line hover:border-main text-main text-[11px] cursor-pointer"
                              >
                                View / Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Practitioners Today Status */}
            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-main font-normal">Practitioners Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {practitioners.map((p) => {
                  const dayOfWeek = new Date().getDay();
                  const pSched = weeklySchedules[p.id] || [];
                  const todaySched = pSched.find((d) => d.dayOfWeek === dayOfWeek);
                  const isOffToday = !todaySched || todaySched.isOff || todaySched.slots.length === 0;

                  return (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl border border-line bg-card flex items-center space-x-3"
                    >
                      <img
                        src={p.photo}
                        alt={p.name}
                        className="w-12 h-12 rounded-full object-cover border border-line shrink-0"
                      />
                      <div className="space-y-0.5 overflow-hidden">
                        <div className="font-serif text-base text-main truncate font-medium">{p.name}</div>
                        <div className="text-[11px] text-accent-editorial truncate">{p.role}</div>
                        <div className="text-[10px] text-muted-editorial">
                          Today: {isOffToday ? 'Off Duty' : todaySched?.slots.map((s) => `${s.start}-${s.end}`).join(', ')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. CALENDAR TAB */}
        {/* ========================================================================= */}
        {activeTab === 'calendar' && (
          <div className="space-y-6 fade-in">
            {/* Calendar Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
              <div className="flex items-center space-x-3">
                <h3 className="font-serif text-3xl text-main font-normal">
                  {calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() =>
                      setCalendarDate(
                        new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1)
                      )
                    }
                    className="p-1.5 rounded-lg border border-line hover:border-main cursor-pointer"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalendarDate(new Date())}
                    className="px-2.5 py-1 rounded-lg border border-line text-xs hover:border-main cursor-pointer"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCalendarDate(
                        new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1)
                      )
                    }
                    className="p-1.5 rounded-lg border border-line hover:border-main cursor-pointer"
                    aria-label="Next month"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Practitioner filter */}
                {currentSession?.role === 'practitioner' ? (
                  <div className="px-3 py-1.5 rounded-xl border border-line bg-alt text-main text-xs font-semibold flex items-center space-x-1.5">
                    <span className="text-muted-editorial font-normal">Calendar:</span>
                    <span>{currentSession.name}</span>
                  </div>
                ) : (
                  <select
                    value={calendarPractitionerFilter}
                    onChange={(e) => setCalendarPractitionerFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-line bg-card text-main text-xs focus:outline-none"
                  >
                    <option value="all">All Practitioners</option>
                    {practitioners.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                )}

                {/* View Mode */}
                <div className="inline-flex rounded-full border border-line p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setCalendarViewMode('month')}
                    className={`px-3 py-1 rounded-full cursor-pointer ${
                      calendarViewMode === 'month' ? 'bg-accent-editorial text-white font-medium' : 'text-muted-editorial'
                    }`}
                  >
                    Month
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalendarViewMode('week')}
                    className={`px-3 py-1 rounded-full cursor-pointer ${
                      calendarViewMode === 'week' ? 'bg-accent-editorial text-white font-medium' : 'text-muted-editorial'
                    }`}
                  >
                    Week
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalendarViewMode('day')}
                    className={`px-3 py-1 rounded-full cursor-pointer ${
                      calendarViewMode === 'day' ? 'bg-accent-editorial text-white font-medium' : 'text-muted-editorial'
                    }`}
                  >
                    Day
                  </button>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-editorial">
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Available Working Hours</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-editorial" />
                <span>Booked Session</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Blocked Break</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-muted-editorial/40" />
                <span>Time Off / Vacation</span>
              </span>
            </div>

            {/* Calendar Grid View (Month) */}
            <div className="border border-line rounded-2xl overflow-hidden bg-card shadow-xs">
              <div className="grid grid-cols-7 border-b border-line text-center text-xs uppercase tracking-wider text-muted-editorial py-3 bg-alt/40 font-medium">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>

              <div className="grid grid-cols-7 divide-x divide-y divide-line">
                {(() => {
                  const y = calendarDate.getFullYear();
                  const m = calendarDate.getMonth();
                  const firstDay = (new Date(y, m, 1).getDay() + 6) % 7;
                  const totalDays = new Date(y, m + 1, 0).getDate();
                  const cells = [];

                  // Blank prefix
                  for (let i = 0; i < firstDay; i++) {
                    cells.push(
                      <div key={`blank-${i}`} className="min-h-[110px] p-2 bg-main/20 text-muted-editorial/20" />
                    );
                  }

                  // Month days
                  for (let day = 1; day <= totalDays; day++) {
                    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayBookings = bookings.filter((b) => {
                      if (b.date !== dateStr || b.status === 'Cancelled') return false;
                      if (calendarPractitionerFilter !== 'all' && b.practitionerId !== calendarPractitionerFilter) return false;
                      return true;
                    });

                    const dayOverrides = specificAvailabilities.filter((sa) => {
                      if (sa.date !== dateStr) return false;
                      if (calendarPractitionerFilter !== 'all' && sa.practitionerId !== calendarPractitionerFilter) return false;
                      return true;
                    });

                    const isToday = dateStr === todayStr;

                    cells.push(
                      <div
                        key={dateStr}
                        className={`min-h-[110px] p-2 flex flex-col justify-between hover:bg-alt/30 transition-colors ${
                          isToday ? 'bg-accent-editorial/5' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-xs font-medium w-6 h-6 rounded-full flex items-center justify-center ${
                              isToday ? 'bg-accent-editorial text-white' : 'text-main'
                            }`}
                          >
                            {day}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setNewSpecificDate(dateStr);
                              setActiveTab('availability');
                            }}
                            className="text-[10px] text-muted-editorial hover:text-accent-editorial cursor-pointer"
                            title="Manage availability on this date"
                          >
                            + Slot
                          </button>
                        </div>

                        {/* Event Tags */}
                        <div className="space-y-1 overflow-y-auto max-h-[75px] no-scrollbar">
                          {dayBookings.map((b) => (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => setSelectedBookingDetail(b)}
                              className="w-full text-left p-1 rounded-md text-[10px] bg-accent-editorial text-white truncate cursor-pointer hover:opacity-90 block"
                            >
                              {b.startTime} {b.firstName} ({b.practitionerName.split(' ')[0]})
                            </button>
                          ))}

                          {dayOverrides.map((ov) => (
                            <div
                              key={ov.id}
                              className={`p-1 rounded-md text-[10px] truncate ${
                                ov.type === 'TIME_OFF'
                                  ? 'bg-muted-editorial/20 text-muted-editorial'
                                  : 'bg-amber-500/20 text-amber-800 dark:text-amber-300'
                              }`}
                            >
                              {ov.type}: {ov.startTime}–{ov.endTime}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return cells;
                })()}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. BOOKINGS MANAGEMENT TAB */}
        {/* ========================================================================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-3xl text-main font-normal">Bookings Directory</h3>
                <p className="text-xs text-muted-editorial">
                  Comprehensive register of all appointment reservations and lifecycle statuses.
                </p>
              </div>

              {/* Search & Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-muted-editorial" />
                  <input
                    type="text"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    placeholder="Search client, email..."
                    className="pl-8 pr-4 py-2 rounded-xl border border-line bg-card text-xs text-main focus:outline-none focus:border-accent-editorial"
                  />
                </div>

                <select
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-line bg-card text-xs text-main focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="No-show">No-show</option>
                </select>

                {currentSession?.role === 'practitioner' ? (
                  <div className="px-3 py-2 rounded-xl border border-line bg-alt text-xs text-main font-semibold flex items-center space-x-1">
                    <span className="text-muted-editorial font-normal">Practitioner:</span>
                    <span>{currentSession.name}</span>
                  </div>
                ) : (
                  <select
                    value={bookingPractitionerFilter}
                    onChange={(e) => setBookingPractitionerFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-line bg-card text-xs text-main focus:outline-none"
                  >
                    <option value="all">All Practitioners</option>
                    {practitioners.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Bookings Table */}
            <div className="border border-line rounded-2xl overflow-hidden bg-card shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-line bg-alt/60 text-muted-editorial uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Reference</th>
                      <th className="p-4">Date & Time</th>
                      <th className="p-4">Client</th>
                      <th className="p-4">Practitioner</th>
                      <th className="p-4">Offering</th>
                      <th className="p-4">Investment</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {(() => {
                      const filteredList = bookings.filter((b) => {
                        if (bookingStatusFilter !== 'all' && b.status !== bookingStatusFilter) return false;
                        if (bookingPractitionerFilter !== 'all' && b.practitionerId !== bookingPractitionerFilter) return false;
                        if (bookingSearch.trim()) {
                          const q = bookingSearch.toLowerCase();
                          const matchName = `${b.firstName} ${b.lastName}`.toLowerCase().includes(q);
                          const matchEmail = b.email.toLowerCase().includes(q);
                          const matchId = b.id.toLowerCase().includes(q);
                          return matchName || matchEmail || matchId;
                        }
                        return true;
                      });

                      if (filteredList.length === 0) {
                        return (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-muted-editorial text-xs">
                              No appointments found. New original bookings submitted through the booking flow will appear here.
                            </td>
                          </tr>
                        );
                      }

                      return filteredList.map((b) => (
                        <tr key={b.id} className="hover:bg-alt/30 transition-colors">
                          <td className="p-4 font-mono font-medium text-accent-editorial">{b.id}</td>
                          <td className="p-4 font-medium text-main">
                            <div>{b.date}</div>
                            <div className="text-[11px] text-muted-editorial">{b.startTime}–{b.endTime}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-main">{b.firstName} {b.lastName}</div>
                            <div className="text-[11px] text-muted-editorial">{b.email} &bull; {b.phone}</div>
                          </td>
                          <td className="p-4 text-main">{b.practitionerName}</td>
                          <td className="p-4 text-muted-editorial">{b.serviceName} ({b.duration}m)</td>
                          <td className="p-4 font-medium text-main">{b.currency}{b.price}</td>
                          <td className="p-4">
                            <select
                              value={b.status}
                              onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                              className="px-2 py-1 rounded-md border border-line bg-main text-[11px] font-medium"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                              <option value="No-show">No-show</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedBookingDetail(b)}
                              className="px-3 py-1 rounded-full border border-line hover:border-main text-main text-[11px] cursor-pointer"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. PRACTITIONERS TAB */}
        {/* ========================================================================= */}
        {activeTab === 'practitioners' && (
          <div className="space-y-6 fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-3xl text-main font-normal">Practitioners Management</h3>
                <p className="text-xs text-muted-editorial">
                  Configure therapist bios, roles, session assignments, and active availability status.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingPractitioner({ active: true, services: ['individual-consultation'] })}
                className="px-4 py-2 rounded-full text-xs uppercase tracking-widest bg-accent-editorial text-white hover:opacity-90 font-medium cursor-pointer shadow-xs flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Practitioner</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {practitioners.map((p) => (
                <div
                  key={p.id}
                  className={`p-6 rounded-2xl border border-line bg-card flex flex-col justify-between space-y-4 shadow-xs ${
                    !p.active ? 'opacity-60 grayscale-50' : ''
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4">
                      <img
                        src={p.photo}
                        alt={p.name}
                        className="w-16 h-16 rounded-full object-cover border border-line shrink-0"
                      />
                      <div>
                        <h4 className="font-serif text-xl text-main font-medium">{p.name}</h4>
                        <p className="text-xs text-accent-editorial">{p.role}</p>
                        <span
                          className={`inline-block mt-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            p.active ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'bg-alt text-muted-editorial'
                          }`}
                        >
                          {p.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-editorial leading-relaxed line-clamp-3">{p.bio}</p>

                    <div className="pt-2 border-t border-line text-xs text-muted-editorial">
                      <span className="font-medium text-main block mb-1">Assigned Services:</span>
                      <div className="flex flex-wrap gap-1">
                        {p.services.map((sid) => {
                          const s = services.find((item) => item.id === sid);
                          return (
                            <span key={sid} className="px-2 py-0.5 rounded-md bg-alt text-[10px] text-main">
                              {s ? s.name : sid}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-line flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setAvailPractitionerId(p.id);
                        setActiveTab('availability');
                      }}
                      className="text-xs text-accent-editorial hover:underline cursor-pointer"
                    >
                      Working Hours &rarr;
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingPractitioner(p)}
                      className="px-3 py-1 rounded-full border border-line text-xs text-main hover:border-main cursor-pointer"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. SERVICES TAB */}
        {/* ========================================================================= */}
        {activeTab === 'services' && (
          <div className="space-y-6 fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-3xl text-main font-normal">Session Offerings Management</h3>
                <p className="text-xs text-muted-editorial">
                  Configure services, durations, prices, eligible practitioners, and visibility.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingService({
                    duration: 60,
                    price: 110,
                    currency: '€',
                    category: 'general',
                    active: true,
                    eligiblePractitioners: ['daniela'],
                  })
                }
                className="px-4 py-2 rounded-full text-xs uppercase tracking-widest bg-accent-editorial text-white hover:opacity-90 font-medium cursor-pointer shadow-xs flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Service</span>
              </button>
            </div>

            <div className="border border-line rounded-2xl overflow-hidden bg-card shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-line bg-alt/60 text-muted-editorial uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Service Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Duration</th>
                      <th className="p-4">Investment</th>
                      <th className="p-4">Eligible Practitioners</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {services.map((s) => (
                      <tr key={s.id} className="hover:bg-alt/30 transition-colors">
                        <td className="p-4">
                          <div className="font-medium text-main text-sm">{s.name}</div>
                          <div className="text-[11px] text-muted-editorial line-clamp-1 max-w-sm">
                            {s.description}
                          </div>
                        </td>
                        <td className="p-4 uppercase tracking-wider text-[11px] text-muted-editorial">
                          {s.category}
                        </td>
                        <td className="p-4 text-main font-medium">{s.duration} minutes</td>
                        <td className="p-4 font-serif text-base text-main font-medium">
                          {s.currency}
                          {s.price}
                        </td>
                        <td className="p-4 text-muted-editorial">
                          {s.eligiblePractitioners.length} practitioners
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-semibold ${
                              s.active ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'bg-alt text-muted-editorial'
                            }`}
                          >
                            {s.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={() => setEditingService(s)}
                            className="px-3 py-1 rounded-full border border-line text-xs text-main hover:border-main cursor-pointer"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5b. WORKSHOPS TAB (Full Sanctuary Access / Administrator) */}
        {/* ========================================================================= */}
        {activeTab === 'workshops' && (
          <div className="space-y-8 fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-serif text-3xl text-main font-normal">Workshops &amp; Immersions</h3>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent-editorial/10 text-accent-editorial font-semibold">
                    Full Sanctuary Access
                  </span>
                </div>
                <p className="text-xs text-muted-editorial">
                  Curate, schedule, and publish group embodiment workshops, seasonal circles, and masterclasses to the public site.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingWorkshop({
                    title: '',
                    subtitle: '',
                    date: '',
                    time: '10:00 – 17:00',
                    location: 'SHE. Academy Sanctuary, Copenhagen',
                    facilitators: ['Mgr. Daniela Torp'],
                    capacity: 12,
                    spotsLeft: 12,
                    price: 3500,
                    currency: 'kr',
                    description: '',
                    curriculum: [],
                    image: 'https://raw.githubusercontent.com/alansmorais/she/main/images/for-women-seated.jpg',
                  });
                  setWorkshopCurriculumInput('');
                }}
                className="px-4 py-2 rounded-full text-xs uppercase tracking-widest bg-accent-editorial text-white hover:opacity-90 font-medium cursor-pointer shadow-xs flex items-center space-x-1.5 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Workshop</span>
              </button>
            </div>

            {/* If no workshops */}
            {workshopsList.length === 0 ? (
              <div className="rounded-2xl border border-line bg-card p-10 text-center space-y-4 max-w-xl mx-auto shadow-xs">
                <div className="w-12 h-12 rounded-full bg-alt/50 text-accent-editorial flex items-center justify-center mx-auto">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-2xl text-main font-normal">No Workshops Scheduled</h4>
                  <p className="text-xs text-muted-editorial leading-relaxed">
                    There are currently no group workshops published. As Administrator with Full Sanctuary Access, you can add upcoming retreats, circles, or immersions that will immediately appear on the public Workshops page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingWorkshop({
                      title: '',
                      subtitle: '',
                      date: '',
                      time: '10:00 – 17:00',
                      location: 'SHE. Academy Sanctuary, Copenhagen',
                      facilitators: ['Mgr. Daniela Torp'],
                      capacity: 12,
                      spotsLeft: 12,
                      price: 3500,
                      currency: 'kr',
                      description: '',
                      curriculum: [],
                      image: 'https://raw.githubusercontent.com/alansmorais/she/main/images/for-women-seated.jpg',
                    });
                    setWorkshopCurriculumInput('');
                  }}
                  className="px-6 py-2.5 rounded-full text-xs uppercase tracking-widest bg-accent-editorial text-white hover:opacity-90 font-semibold cursor-pointer shadow-xs inline-flex items-center space-x-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Workshop</span>
                </button>
              </div>
            ) : (
              <div className="border border-line rounded-2xl overflow-hidden bg-card shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-line bg-alt/60 text-muted-editorial uppercase tracking-wider">
                      <tr>
                        <th className="p-4">Workshop</th>
                        <th className="p-4">Date &amp; Time</th>
                        <th className="p-4">Location</th>
                        <th className="p-4">Faculty / Facilitators</th>
                        <th className="p-4">Capacity &amp; Spots</th>
                        <th className="p-4">Investment</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {workshopsList.map((ws) => (
                        <tr key={ws.id} className="hover:bg-alt/30 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={ws.image || 'https://raw.githubusercontent.com/alansmorais/she/main/images/for-women-seated.jpg'}
                                alt={ws.title}
                                className="w-12 h-12 rounded-lg object-cover border border-line shrink-0"
                              />
                              <div>
                                <div className="font-medium text-main text-sm">{ws.title}</div>
                                {ws.subtitle && (
                                  <div className="text-[11px] text-accent-editorial">{ws.subtitle}</div>
                                )}
                                <div className="text-[11px] text-muted-editorial line-clamp-1 max-w-xs mt-0.5">
                                  {ws.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-main font-medium whitespace-nowrap">
                            <div>{ws.date}</div>
                            <div className="text-[11px] text-muted-editorial font-normal">{ws.time}</div>
                          </td>
                          <td className="p-4 text-muted-editorial max-w-xs">
                            {ws.location}
                          </td>
                          <td className="p-4 text-muted-editorial">
                            {ws.facilitators && ws.facilitators.length > 0 ? ws.facilitators.join(', ') : 'Faculty'}
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                              {ws.spotsLeft} / {ws.capacity} spots left
                            </span>
                          </td>
                          <td className="p-4 font-serif text-base text-main font-medium whitespace-nowrap">
                            {ws.price.toLocaleString()} {ws.currency || 'kr'}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingWorkshop(ws);
                                  setWorkshopCurriculumInput((ws.curriculum || []).join('\n'));
                                }}
                                className="px-3 py-1 rounded-full border border-line text-xs text-main hover:border-main cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteWorkshop(ws.id, ws.title)}
                                className="p-1 rounded-full text-muted-editorial hover:text-red-500 border border-line cursor-pointer"
                                title="Delete Workshop"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'availability' && (
          <div className="space-y-8 fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
              <div>
                <h3 className="font-serif text-3xl text-main font-normal">Practitioner Working Hours</h3>
                <p className="text-xs text-muted-editorial">
                  Configure weekly recurring schedules, split shifts, specific vacation periods, and blocked breaks.
                </p>
              </div>

              {/* Practitioner Switcher */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-editorial">Practitioner:</span>
                {currentSession?.role === 'practitioner' ? (
                  <div className="px-4 py-2 rounded-xl border border-line bg-alt text-main text-xs font-semibold">
                    {currentSession.name}
                  </div>
                ) : (
                  <select
                    value={availPractitionerId}
                    onChange={(e) => setAvailPractitionerId(e.target.value)}
                    className="px-4 py-2 rounded-xl border border-line bg-card text-main text-xs font-medium focus:outline-none focus:border-accent-editorial"
                  >
                    {practitioners.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.role.split('•')[0].trim()})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Weekly Schedule Matrix */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-widest text-main font-semibold">
                Weekly Recurring Schedule
              </h4>

              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6, 0].map((dayOfWeek) => {
                  const pSched = weeklySchedules[availPractitionerId] || [];
                  const dayData = pSched.find((d) => d.dayOfWeek === dayOfWeek) || {
                    dayOfWeek,
                    isOff: true,
                    slots: [],
                  };

                  return (
                    <div
                      key={dayOfWeek}
                      className={`p-4 rounded-xl border border-line bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        dayData.isOff ? 'bg-alt/30 opacity-75' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-4 min-w-[140px]">
                        <button
                          type="button"
                          onClick={() => handleToggleDayOff(dayOfWeek)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                            dayData.isOff
                              ? 'bg-alt text-muted-editorial border border-line'
                              : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                          }`}
                        >
                          {dayData.isOff ? 'OFF' : 'WORKING'}
                        </button>
                        <span className="font-serif text-lg text-main font-medium">
                          {dayNames[dayOfWeek]}
                        </span>
                      </div>

                      {/* Working Slots */}
                      <div className="flex-1 flex flex-wrap items-center gap-3">
                        {!dayData.isOff && dayData.slots.length > 0 ? (
                          dayData.slots.map((slot, slotIdx) => (
                            <div
                              key={slotIdx}
                              className="flex items-center space-x-2 p-1.5 rounded-lg border border-line bg-main text-xs"
                            >
                              <input
                                type="time"
                                value={slot.start}
                                onChange={(e) =>
                                  handleUpdateWeeklySlot(dayOfWeek, slotIdx, 'start', e.target.value)
                                }
                                className="bg-transparent text-main text-xs focus:outline-none"
                              />
                              <span>–</span>
                              <input
                                type="time"
                                value={slot.end}
                                onChange={(e) =>
                                  handleUpdateWeeklySlot(dayOfWeek, slotIdx, 'end', e.target.value)
                                }
                                className="bg-transparent text-main text-xs focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleDeleteWeeklySlot(dayOfWeek, slotIdx)}
                                className="text-muted-editorial hover:text-red-500 cursor-pointer p-0.5"
                                title="Remove shift"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-muted-editorial italic">
                            No active working shifts scheduled on this day.
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleAddWeeklySlot(dayOfWeek)}
                          className="px-2.5 py-1 rounded-md border border-line text-[11px] text-muted-editorial hover:text-main cursor-pointer"
                        >
                          + Add Shift / Period
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Date-Specific Overrides (Vacation / Extra Dates / Blocked) */}
            <div className="space-y-4 pt-6 border-t border-line">
              <h4 className="text-xs uppercase tracking-widest text-main font-semibold">
                Date-Specific Overrides & Time Off
              </h4>

              {/* Form to add override */}
              <form
                onSubmit={handleAddSpecificOverride}
                className="p-5 rounded-2xl border border-line bg-alt/40 grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs items-end"
              >
                <div>
                  <label className="block text-muted-editorial mb-1 font-medium">Date *</label>
                  <input
                    type="date"
                    required
                    value={newSpecificDate}
                    onChange={(e) => setNewSpecificDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-line bg-card text-main text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-muted-editorial mb-1 font-medium">Type</label>
                  <select
                    value={newSpecificType}
                    onChange={(e) => setNewSpecificType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-line bg-card text-main text-xs focus:outline-none"
                  >
                    <option value="TIME_OFF">Time Off (Vacation)</option>
                    <option value="BLOCKED">Blocked (Break / Meeting)</option>
                    <option value="AVAILABLE">Extra Available Hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-muted-editorial mb-1 font-medium">Hours</label>
                  <div className="flex items-center space-x-1">
                    <input
                      type="time"
                      value={newSpecificStart}
                      onChange={(e) => setNewSpecificStart(e.target.value)}
                      className="w-full px-2 py-2 rounded-xl border border-line bg-card text-main text-xs"
                    />
                    <span>–</span>
                    <input
                      type="time"
                      value={newSpecificEnd}
                      onChange={(e) => setNewSpecificEnd(e.target.value)}
                      className="w-full px-2 py-2 rounded-xl border border-line bg-card text-main text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-muted-editorial mb-1 font-medium">Notes</label>
                  <input
                    type="text"
                    value={newSpecificNotes}
                    onChange={(e) => setNewSpecificNotes(e.target.value)}
                    placeholder="e.g. Supervision, Dentist"
                    className="w-full px-3 py-2 rounded-xl border border-line bg-card text-main text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-accent-editorial text-white font-medium hover:opacity-90 cursor-pointer text-xs"
                  >
                    Add Override
                  </button>
                </div>
              </form>

              {/* List of current overrides for this practitioner */}
              <div className="space-y-2">
                {specificAvailabilities
                  .filter((sa) => sa.practitionerId === availPractitionerId)
                  .map((sa) => (
                    <div
                      key={sa.id}
                      className="p-3.5 rounded-xl border border-line bg-card flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                            sa.type === 'TIME_OFF'
                              ? 'bg-muted-editorial/20 text-muted-editorial'
                              : sa.type === 'BLOCKED'
                              ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                              : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                          }`}
                        >
                          {sa.type}
                        </span>
                        <span className="font-medium text-main">{sa.date}</span>
                        <span className="text-muted-editorial">
                          ({sa.startTime} – {sa.endTime})
                        </span>
                        {sa.notes && <span className="text-muted-editorial italic">"{sa.notes}"</span>}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteSpecificOverride(sa.id)}
                        className="text-muted-editorial hover:text-red-500 cursor-pointer p-1"
                        title="Delete override"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 7. CLIENTS DIRECTORY TAB */}
        {/* ========================================================================= */}
        {activeTab === 'clients' && (
          <div className="space-y-6 fade-in">
            <div>
              <h3 className="font-serif text-3xl text-main font-normal">Clients Directory</h3>
              <p className="text-xs text-muted-editorial">
                Automated directory compiled from bookings history.
              </p>
            </div>

            <div className="border border-line rounded-2xl overflow-hidden bg-card shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-line bg-alt/60 text-muted-editorial uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Client Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Total Sessions</th>
                      <th className="p-4">First Visit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {clientsList.map((c) => (
                      <tr key={c.id} className="hover:bg-alt/30 transition-colors">
                        <td className="p-4 font-medium text-main text-sm">
                          {c.firstName} {c.lastName}
                        </td>
                        <td className="p-4 text-muted-editorial">{c.email}</td>
                        <td className="p-4 text-muted-editorial">{c.phone}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full bg-accent-editorial/15 text-accent-editorial font-medium">
                            {c.totalBookings} bookings
                          </span>
                        </td>
                        <td className="p-4 text-muted-editorial">{c.firstBookingDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 8. SETTINGS & SYNC TAB */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-8 fade-in max-w-4xl">
            <div>
              <h3 className="font-serif text-3xl text-main font-normal">Settings & Cloud Synchronization</h3>
              <p className="text-xs text-muted-editorial">
                Connect SHE. Academy directly to your Google Sheets database and Google Apps Script backend.
              </p>
            </div>

            {settingsSavedNotice && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Configuration saved successfully.</span>
              </div>
            )}

            {/* Google Apps Script Connection */}
            <div className="p-6 rounded-2xl border border-line bg-card space-y-6">
              {!isDevAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-6 h-6 text-accent-editorial shrink-0 mt-1" />
                    <div className="space-y-1">
                      <h4 className="font-serif text-xl text-main font-normal">
                        Developer Access Required
                      </h4>
                      <p className="text-xs text-muted-editorial leading-relaxed">
                        To access or modify the Google Apps Script Web App URL and advanced synchronization settings, please enter the developer password.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="password"
                      value={devPasswordInput}
                      onChange={(e) => setDevPasswordInput(e.target.value)}
                      placeholder="Enter Developer Password"
                      className="px-4 py-2 rounded-xl border border-line bg-main text-main text-xs focus:outline-none focus:border-accent-editorial"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (devPasswordInput === settings.developerPassword) {
                          setIsDevAuthenticated(true);
                        } else {
                          alert('Invalid Developer Password');
                        }
                      }}
                      className="px-6 py-2 rounded-full text-xs uppercase tracking-widest bg-accent-editorial text-white hover:opacity-90 font-medium cursor-pointer"
                    >
                      Authenticate
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start space-x-3">
                    <FileSpreadsheet className="w-6 h-6 text-accent-editorial shrink-0 mt-1" />
                    <div className="space-y-1">
                      <h4 className="font-serif text-xl text-main font-normal">
                        Google Sheets & Google Apps Script URL
                      </h4>
                      <p className="text-xs text-muted-editorial leading-relaxed">
                        Deploy your <code className="text-accent-editorial">Code.gs</code> as a Web App in Google Apps
                        Script. Enter the published Web App URL below to automatically synchronize bookings, availability,
                        and client records into your Google Spreadsheet.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-muted-editorial font-medium mb-1.5">
                        Google Apps Script Web App URL
                      </label>
                      <input
                        type="url"
                        value={tempGoogleUrl}
                        onChange={(e) => setTempGoogleUrl(e.target.value)}
                        placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                        className="w-full px-4 py-2.5 rounded-xl border border-line bg-main text-main text-xs font-mono focus:outline-none focus:border-accent-editorial"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-muted-editorial font-medium mb-1.5">
                        Admin Notification Email
                      </label>
                      <input
                        type="email"
                        value={tempAdminEmail}
                        onChange={(e) => setTempAdminEmail(e.target.value)}
                        placeholder="info@she-academy.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-line bg-main text-main text-xs focus:outline-none focus:border-accent-editorial"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[11px] text-muted-editorial">
                        {settings.lastSynced ? `Last configured: ${new Date(settings.lastSynced).toLocaleString()}` : 'Not connected yet'}
                      </span>

                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('CRITICAL: This will wipe all bookings, custom schedules, and settings, returning the app to factory defaults. This cannot be undone. Proceed?')) {
                              storageService.resetToFactoryDefaults();
                            }
                          }}
                          className="px-6 py-2.5 rounded-full text-xs uppercase tracking-widest border border-red-200 text-red-600 hover:bg-red-50 font-medium cursor-pointer"
                        >
                          Reset to Factory Defaults
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-full text-xs uppercase tracking-widest bg-accent-editorial text-white hover:opacity-90 font-medium cursor-pointer shadow-xs"
                        >
                          Save & Test Configuration
                        </button>
                      </div>
                    </div>
                  </form>
                  
                  {/* Stripe Health Check */}
                  <div className="mt-8 pt-8 border-t border-line space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Activity className="w-5 h-5 text-accent-editorial" />
                        <h4 className="font-serif text-lg text-main">Stripe Health Check</h4>
                      </div>
                    </div>

                    <div className="bg-main/50 p-4 rounded-xl border border-line space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-muted-editorial font-bold">Manual Key Test (Optional)</label>
                        <div className="flex gap-2">
                          <input
                            type="password"
                            value={tempStripeKey}
                            onChange={(e) => setTempStripeKey(e.target.value)}
                            placeholder="sk_test_..."
                            className="flex-1 bg-main border border-line rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-accent-editorial"
                          />
                          <button
                            type="button"
                            onClick={checkStripe}
                            disabled={isCheckingStripe}
                            className="px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest bg-main border border-line text-muted-editorial hover:border-accent-editorial hover:text-accent-editorial transition-colors flex items-center space-x-2 disabled:opacity-50"
                          >
                            {isCheckingStripe ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <Activity className="w-3 h-3" />
                            )}
                            <span>{isCheckingStripe ? 'Testing...' : 'Test Key'}</span>
                          </button>
                        </div>
                        <p className="text-[9px] text-muted-editorial italic">
                          Paste a secret key here to test it without saving. If left blank, it will test the active system key.
                        </p>
                      </div>
                    </div>
                    
                    {stripeStatus && (
                      <div className={`p-4 rounded-xl border ${stripeStatus.connection === 'OK' ? 'bg-green-50/30 border-green-100' : 'bg-red-50/30 border-red-100'} space-y-3`}>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-main">Connection:</span>
                          <span className={`text-xs font-bold ${stripeStatus.connection === 'OK' ? 'text-green-600' : 'text-red-600'}`}>
                            {stripeStatus.connection}
                          </span>
                        </div>
                        
                        {stripeStatus.connection === 'OK' ? (
                          <>
                            <div className="flex justify-between text-[11px]">
                              <span className="text-muted-editorial">Stripe Mode:</span>
                              <span className="font-mono font-bold text-accent-editorial">{stripeStatus.mode}</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span className="text-muted-editorial">Account ID:</span>
                              <span className="font-mono text-main">{stripeStatus.accountId}</span>
                            </div>
                            <div className="mt-4 p-3 bg-white rounded-lg border border-line space-y-2">
                              <p className="text-[10px] uppercase tracking-wider text-muted-editorial font-bold">Target Price Check</p>
                              <div className="flex justify-between text-[11px]">
                                <span className="text-muted-editorial">Price ID:</span>
                                <span className="font-mono text-main">price_1UFg59K4oxA1kFWImzbm5wFi</span>
                              </div>
                              <div className="flex justify-between text-[11px]">
                                <span className="text-muted-editorial">Exists:</span>
                                <span className={`font-bold ${stripeStatus.priceExists === 'YES' ? 'text-green-600' : 'text-red-600'}`}>
                                  {stripeStatus.priceExists}
                                </span>
                              </div>
                              {stripeStatus.priceDetails && (
                                <>
                                  <div className="flex justify-between text-[11px]">
                                    <span className="text-muted-editorial">Product Name:</span>
                                    <span className="text-main font-medium">{stripeStatus.priceDetails.productName}</span>
                                  </div>
                                  <div className="flex justify-between text-[11px]">
                                    <span className="text-muted-editorial">Amount:</span>
                                    <span className="text-main font-bold">{stripeStatus.priceDetails.currency} {stripeStatus.priceDetails.amount}</span>
                                  </div>
                                </>
                              )}
                            </div>
                            {stripeStatus.priceExists === 'NO' && (
                              <p className="text-[10px] text-red-600 font-medium bg-red-50 p-2 rounded border border-red-100">
                                CRITICAL: The Price ID exists in the system but NOT in this Stripe account/mode. Verify your STRIPE_SECRET_KEY.
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-xs text-red-600">{stripeStatus.error}</p>
                        )}
                      </div>
                    )}

                    <p className="text-[10px] text-muted-editorial leading-relaxed">
                      This utility pings the Stripe API using your server-side <strong>STRIPE_SECRET_KEY</strong> to verify connectivity and product metadata.
                    </p>
                  </div>

                  {/* Backend Code Viewer */}
                  <div className="mt-8 pt-8 border-t border-line space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Code2 className="w-5 h-5 text-accent-editorial" />
                        <h4 className="font-serif text-lg text-main">Google Apps Script Backend Code</h4>
                      </div>
                      <button
                        onClick={() => {
                          if (backendCode) {
                            navigator.clipboard.writeText(backendCode);
                            setIsCopyingBackendCode(true);
                            setTimeout(() => setIsCopyingBackendCode(false), 2000);
                          }
                        }}
                        className="px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest bg-main border border-line text-muted-editorial hover:border-accent-editorial hover:text-accent-editorial transition-colors flex items-center space-x-2"
                      >
                        {isCopyingBackendCode ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Script to Clipboard</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-muted-editorial leading-relaxed">
                      Copy this entire script and paste it into your Google Apps Script editor. This version includes <strong>Concurrency Locking</strong> and <strong>Practitioner Email Routing</strong>.
                    </p>
                    <div className="relative">
                      <pre className="p-4 rounded-xl bg-main border border-line text-[10px] font-mono text-muted-editorial overflow-auto max-h-[300px] whitespace-pre">
                        {backendCode || 'Loading script content...'}
                      </pre>
                      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-main to-transparent pointer-events-none rounded-b-xl" />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Password & Security Management */}
            <div className="p-6 rounded-2xl border border-line bg-card space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-accent-editorial/10 text-accent-editorial">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl text-main font-normal">
                      Password & Security Management
                    </h4>
                    <p className="text-xs text-muted-editorial">
                      Manage login credentials and secure calendar administration.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setChangePassError(null);
                    setChangePassSuccess(null);
                    setCurrentPassInput('');
                    setNewPassInput('');
                    setConfirmPassInput('');
                    setIsChangePasswordOpen(true);
                  }}
                  className="px-4 py-2 rounded-full bg-accent-editorial text-white text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer shadow-xs"
                >
                  Change My Password
                </button>
              </div>

              {adminResetPassSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{adminResetPassSuccess}</span>
                </div>
              )}

              {/* If Admin is logged in, show all practitioner credentials management */}
              {currentSession?.role === 'admin' && (
                <div className="pt-4 border-t border-line space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-xs uppercase tracking-widest text-main font-semibold">
                        Practitioner Calendar Access
                      </h5>
                      <p className="text-[11px] text-muted-editorial">
                        Each practitioner starts with 1 standard password and then customizes it. You can reset any practitioner's password to the standard initial password if they ever lose access.
                      </p>
                    </div>
                  </div>

                  <div className="divide-y divide-line rounded-xl border border-line overflow-hidden bg-main">
                    {practitioners.map((p) => {
                      const isCustom = storageService.hasCustomPassword(p.id);
                      return (
                        <div key={p.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                          <div className="space-y-0.5">
                            <span className="font-semibold text-main">{p.name}</span>
                            <div className="text-[11px] text-muted-editorial">
                              {p.role.split('•')[0].trim()} &bull; {p.email}
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                                isCustom
                                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                              }`}
                            >
                              {isCustom ? 'Personal Password Active' : 'Standard Initial Password'}
                            </span>

                            {isCustom && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Reset password for ${p.name} back to the standard initial password?`)) {
                                    storageService.resetPractitionerPassword(p.id);
                                    setAdminResetPassSuccess(`Password for ${p.name} reset to standard initial password.`);
                                    setTimeout(() => setAdminResetPassSuccess(null), 3000);
                                  }
                                }}
                                className="px-3 py-1 rounded-full border border-line text-[11px] text-muted-editorial hover:text-accent-editorial hover:border-accent-editorial cursor-pointer"
                              >
                                Reset to Standard
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Architecture Explanation (Required by Prompt Section 16 & 8) */}
            <div className="p-6 rounded-2xl border border-line bg-alt/40 space-y-4 text-xs">
              <div className="flex items-center space-x-2 text-main font-semibold">
                <Shield className="w-4 h-4 text-accent-editorial" />
                <span>Security Architecture & Google Apps Script Concurrency Locking</span>
              </div>
              <p className="text-muted-editorial leading-relaxed">
                <strong>Conflict Prevention & Atomic Locks:</strong> To guarantee zero double-bookings, our backend in{' '}
                <code className="text-accent-editorial">Code.gs</code> wraps appointment creation inside{' '}
                <code className="text-accent-editorial">LockService.getScriptLock().tryLock(10000)</code>. This ensures
                that if two clients press "Confirm" at the exact same fraction of a second, the requests are serialized
                atomically. The second request validates against the newly recorded booking and gracefully returns an
                availability error rather than overlapping.
              </p>
              <p className="text-muted-editorial leading-relaxed">
                <strong>Admin Security:</strong> In Google Apps Script Web Apps running with{' '}
                <em>"Execute as: Me"</em>, public requests do not require Google login. Client-side authentication in this
                dashboard uses local session tokens combined with server-side validation keys in Google Apps Script. For
                strict enterprise Google Workspace setups, change the deployment setting to <em>"Who has access: Only myself"</em> or
                use a Cloud Run proxy with OAuth 2.0.
              </p>
            </div>

            {/* Demo Data Reset */}
            <div className="p-6 rounded-2xl border border-line bg-card space-y-3">
              <h4 className="font-serif text-lg text-main font-normal">Database Management</h4>
              <p className="text-xs text-muted-editorial">
                Reset all practitioner working hours, initial bookings, and services back to pristine factory defaults.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset database to initial pristine state?')) {
                    storageService.resetToDefaults();
                    onRefreshData();
                    alert('Database has been reset to defaults.');
                  }
                }}
                className="px-4 py-2 rounded-full border border-red-500/40 text-red-600 dark:text-red-400 text-xs uppercase tracking-widest hover:bg-red-500/10 cursor-pointer"
              >
                Reset to Pristine Default Data
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* BOOKING DETAIL MODAL */}
      {/* ========================================================================= */}
      {selectedBookingDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card border border-line rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <span className="text-xs text-muted-editorial uppercase tracking-wider block">Reservation</span>
                <h3 className="font-serif text-2xl text-main font-normal">{selectedBookingDetail.id}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBookingDetail(null)}
                className="p-1.5 rounded-full text-muted-editorial hover:text-main cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-muted-editorial block">Client Name</span>
                <span className="font-medium text-main text-sm">
                  {selectedBookingDetail.firstName} {selectedBookingDetail.lastName}
                </span>
              </div>

              <div>
                <span className="text-muted-editorial block">Status</span>
                <select
                  value={selectedBookingDetail.status}
                  onChange={(e) =>
                    handleStatusChange(selectedBookingDetail.id, e.target.value as BookingStatus)
                  }
                  className="mt-0.5 px-2.5 py-1 rounded-md border border-line bg-main text-xs font-medium text-main"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="No-show">No-show</option>
                </select>
              </div>

              <div>
                <span className="text-muted-editorial block">Email</span>
                <span className="text-main">{selectedBookingDetail.email}</span>
              </div>

              <div>
                <span className="text-muted-editorial block">Phone</span>
                <span className="text-main">{selectedBookingDetail.phone}</span>
              </div>

              <div>
                <span className="text-muted-editorial block">Practitioner</span>
                <span className="font-medium text-main">{selectedBookingDetail.practitionerName}</span>
              </div>

              <div>
                <span className="text-muted-editorial block">Session Offering</span>
                <span className="text-main">{selectedBookingDetail.serviceName}</span>
              </div>

              <div>
                <span className="text-muted-editorial block">Date</span>
                <span className="text-main">{selectedBookingDetail.date}</span>
              </div>

              <div>
                <span className="text-muted-editorial block">Time & Duration</span>
                <span className="text-main">
                  {selectedBookingDetail.startTime}–{selectedBookingDetail.endTime} (
                  {selectedBookingDetail.duration} min)
                </span>
              </div>

              <div>
                <span className="text-muted-editorial block">Investment</span>
                <span className="text-main font-serif text-base">
                  {selectedBookingDetail.currency}
                  {selectedBookingDetail.price}
                </span>
              </div>

              <div className="col-span-2 pt-2 border-t border-line">
                <span className="text-muted-editorial block">Client Notes</span>
                <p className="text-main italic mt-0.5">
                  {selectedBookingDetail.notes ? `"${selectedBookingDetail.notes}"` : 'No notes provided.'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-line flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  handleStatusChange(selectedBookingDetail.id, 'Cancelled');
                  setSelectedBookingDetail(null);
                }}
                className="text-xs text-red-600 dark:text-red-400 hover:underline cursor-pointer"
              >
                Cancel Booking
              </button>

              <button
                type="button"
                onClick={() => setSelectedBookingDetail(null)}
                className="px-5 py-2 rounded-full bg-accent-editorial text-white text-xs uppercase tracking-widest font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT PRACTITIONER MODAL */}
      {/* ========================================================================= */}
      {editingPractitioner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card border border-line rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="font-serif text-2xl text-main font-normal">
                {editingPractitioner.id ? 'Edit Practitioner' : 'Add New Practitioner'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingPractitioner(null)}
                className="p-1.5 rounded-full text-muted-editorial hover:text-main cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSavePractitioner(editingPractitioner);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-muted-editorial font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingPractitioner.name || ''}
                  onChange={(e) =>
                    setEditingPractitioner({ ...editingPractitioner, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-line bg-main text-main text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-muted-editorial font-medium mb-1">Professional Role *</label>
                <input
                  type="text"
                  required
                  value={editingPractitioner.role || ''}
                  onChange={(e) =>
                    setEditingPractitioner({ ...editingPractitioner, role: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-line bg-main text-main text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-muted-editorial font-medium mb-1">Photo URL *</label>
                <input
                  type="url"
                  required
                  value={editingPractitioner.photo || ''}
                  onChange={(e) =>
                    setEditingPractitioner({ ...editingPractitioner, photo: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-line bg-main text-main text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-muted-editorial font-medium mb-1">Biography *</label>
                <textarea
                  rows={3}
                  required
                  value={editingPractitioner.bio || ''}
                  onChange={(e) =>
                    setEditingPractitioner({ ...editingPractitioner, bio: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-line bg-main text-main text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-editorial font-medium mb-1">Gender</label>
                  <select
                    value={editingPractitioner.gender || 'female'}
                    onChange={(e) =>
                      setEditingPractitioner({ ...editingPractitioner, gender: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-line bg-main text-main text-xs focus:outline-none"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-muted-editorial font-medium mb-1">Status</label>
                  <select
                    value={editingPractitioner.active ? 'true' : 'false'}
                    onChange={(e) =>
                      setEditingPractitioner({ ...editingPractitioner, active: e.target.value === 'true' })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-line bg-main text-main text-xs focus:outline-none"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-muted-editorial font-medium mb-1">Assigned Services</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-xl border border-line bg-main max-h-36 overflow-y-auto">
                  {services.map((s) => {
                    const isChecked = (editingPractitioner.services || []).includes(s.id);
                    return (
                      <label key={s.id} className="flex items-center space-x-2 text-[11px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const current = editingPractitioner.services || [];
                            const next = e.target.checked
                              ? [...current, s.id]
                              : current.filter((id) => id !== s.id);
                            setEditingPractitioner({ ...editingPractitioner, services: next });
                          }}
                        />
                        <span className="truncate">{s.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-line flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingPractitioner(null)}
                  className="px-4 py-2 rounded-full border border-line text-muted-editorial hover:text-main cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-accent-editorial text-white font-medium hover:opacity-90 cursor-pointer"
                >
                  Save Practitioner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT SERVICE MODAL */}
      {/* ========================================================================= */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card border border-line rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="font-serif text-2xl text-main font-normal">
                {editingService.id ? 'Edit Offering' : 'New Offering'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="p-1.5 rounded-full text-muted-editorial hover:text-main cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveService(editingService);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-muted-editorial font-medium mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  value={editingService.name || ''}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-line bg-main text-main text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-editorial font-medium mb-1">Category</label>
                  <select
                    value={editingService.category || 'general'}
                    onChange={(e) =>
                      setEditingService({ ...editingService, category: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-line bg-main text-main text-xs focus:outline-none"
                  >
                    <option value="general">General Somatics</option>
                    <option value="women">For Women</option>
                    <option value="men">For Men</option>
                    <option value="movement">Movement & Conditioning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-muted-editorial font-medium mb-1">Duration (Minutes) *</label>
                  <input
                    type="number"
                    required
                    min={30}
                    step={15}
                    value={editingService.duration || 60}
                    onChange={(e) =>
                      setEditingService({ ...editingService, duration: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-line bg-main text-main text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-editorial font-medium mb-1">Price *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingService.price || 120}
                    onChange={(e) =>
                      setEditingService({ ...editingService, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-line bg-main text-main text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-muted-editorial font-medium mb-1">Currency Symbol</label>
                  <input
                    type="text"
                    required
                    value={editingService.currency || '€'}
                    onChange={(e) =>
                      setEditingService({ ...editingService, currency: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-line bg-main text-main text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-editorial font-medium mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editingService.description || ''}
                  onChange={(e) =>
                    setEditingService({ ...editingService, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-line bg-main text-main text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-muted-editorial font-medium mb-1">Eligible Practitioners</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-xl border border-line bg-main max-h-36 overflow-y-auto">
                  {practitioners.map((p) => {
                    const isChecked = (editingService.eligiblePractitioners || []).includes(p.id);
                    return (
                      <label key={p.id} className="flex items-center space-x-2 text-[11px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const current = editingService.eligiblePractitioners || [];
                            const next = e.target.checked
                              ? [...current, p.id]
                              : current.filter((id) => id !== p.id);
                            setEditingService({ ...editingService, eligiblePractitioners: next });
                          }}
                        />
                        <span className="truncate">{p.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-line flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-full border border-line text-muted-editorial hover:text-main cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-accent-editorial text-white font-medium hover:opacity-90 cursor-pointer"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* WORKSHOP FORM MODAL (Full Sanctuary Access / Administrator) */}
      {/* ========================================================================= */}
      {editingWorkshop && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-card border border-line rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h4 className="font-serif text-2xl text-main font-normal">
                  {editingWorkshop.id ? 'Edit Workshop' : 'Create New Immersion Workshop'}
                </h4>
                <p className="text-xs text-muted-editorial">
                  Configure details, dates, facilitator faculty, and booking capacity for public display.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingWorkshop(null)}
                className="p-1.5 rounded-lg text-muted-editorial hover:text-main cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWorkshop} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-muted-editorial font-medium mb-1">
                    Workshop Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingWorkshop.title || ''}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, title: e.target.value })}
                    placeholder="e.g. Sensual Awakening & Pelvic Vitality Immersion"
                    className="w-full px-3 py-2 rounded-xl border border-line bg-main text-main text-xs focus:outline-none focus:border-accent-editorial"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-muted-editorial font-medium mb-1">
                    Subtitle / Category Eyebrow
                  </label>
                  <input
                    type="text"
                    value={editingWorkshop.subtitle || ''}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, subtitle: e.target.value })}
                    placeholder="e.g. A 2-Day Somatic Exploration for Women"
                    className="w-full px-3 py-2 rounded-xl border border-line bg-main text-main text-xs focus:outline-none focus:border-accent-editorial"
                  />
                </div>

                <div>
                  <label className="block text-muted-editorial font-medium mb-1">
                    Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingWorkshop.date || ''}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, date: e.target.value })}
                    placeholder="e.g. October 24–25, 2026"
                    className="w-full px-3 py-2 rounded-xl border border-line bg-main text-main text-xs focus:outline-none focus:border-accent-editorial"
                  />
                </div>

                <div>
                  <label className="block text-muted-editorial font-medium mb-1">
                    Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingWorkshop.time || ''}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, time: e.target.value })}
                    placeholder="e.g. 10:00 – 17:00"
                    className="w-full px-3 py-2 rounded-xl border border-line bg-main text-main text-xs focus:outline-none focus:border-accent-editorial"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-muted-editorial font-medium mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingWorkshop.location || ''}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, location: e.target.value })}
                    placeholder="e.g. SHE. Academy Sanctuary, Copenhagen"
                    className="w-full px-3 py-2 rounded-xl border border-line bg-main text-main text-xs focus:outline-none focus:border-accent-editorial"
                  />
                </div>

                <div>
                  <label className="block text-muted-editorial font-medium mb-1">
                    Total Capacity (Attendees) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={editingWorkshop.capacity || 12}
                    onChange={(e) => {
                      const cap = parseInt(e.target.value) || 1;
                      setEditingWorkshop({
                        ...editingWorkshop,
                        capacity: cap,
                        spotsLeft: Math.min(editingWorkshop.spotsLeft || cap, cap),
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-line bg-main text-main text-xs focus:outline-none focus:border-accent-editorial"
                  />
                </div>

                <div>
                  <label className="block text-muted-editorial font-medium mb-1">
                    Spots Left Open *
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={editingWorkshop.capacity || 12}
                    required
                    value={editingWorkshop.spotsLeft ?? 12}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, spotsLeft: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-line bg-main text-main text-xs focus:outline-none focus:border-accent-editorial"
                  />
                </div>

                <div>
                  <label className="block text-muted-editorial font-medium mb-1">
                    Investment / Price *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editingWorkshop.price || 3500}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-line bg-main text-main text-xs focus:outline-none focus:border-accent-editorial"
                  />
                </div>

                <div>
                  <label className="block text-muted-editorial font-medium mb-1">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    value={editingWorkshop.currency || 'kr'}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, currency: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-line bg-main text-main text-xs focus:outline-none focus:border-accent-editorial"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-muted-editorial font-medium mb-1">
                    Facilitators (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={(editingWorkshop.facilitators || []).join(', ')}
                    onChange={(e) =>
                      setEditingWorkshop({
                        ...editingWorkshop,
                        facilitators: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="e.g. Mgr. Daniela Torp, Ewa"
                    className="w-full px-3 py-2 rounded-xl border border-line bg-main text-main text-xs focus:outline-none focus:border-accent-editorial"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-muted-editorial font-medium mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={editingWorkshop.image || ''}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-line bg-main text-main text-xs focus:outline-none focus:border-accent-editorial"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-muted-editorial font-medium mb-1">
                    Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={editingWorkshop.description || ''}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, description: e.target.value })}
                    placeholder="Describe the immersion container, intention, who it is for, and what to expect..."
                    className="w-full px-3 py-2 rounded-xl border border-line bg-main text-main text-xs focus:outline-none focus:border-accent-editorial"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-muted-editorial font-medium mb-1">
                    Curriculum Highlights (One item per line)
                  </label>
                  <textarea
                    rows={3}
                    value={workshopCurriculumInput}
                    onChange={(e) => setWorkshopCurriculumInput(e.target.value)}
                    placeholder="Anatomy and sensory mapping&#10;Gentle partner and solo de-armouring&#10;Embodied boundary practice and consent rituals"
                    className="w-full px-3 py-2 rounded-xl border border-line bg-main text-main text-xs focus:outline-none focus:border-accent-editorial"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-line flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingWorkshop(null)}
                  className="px-4 py-2 rounded-full border border-line text-muted-editorial hover:text-main cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-accent-editorial text-white font-medium hover:opacity-90 cursor-pointer shadow-xs"
                >
                  Save Workshop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* CHANGE PASSWORD MODAL */}
      {/* ========================================================================= */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-line rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-accent-editorial/10 text-accent-editorial">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-2xl text-main font-normal">
                    {currentSession?.isFirstAccess ? 'Set Private Password' : 'Change Password'}
                  </h4>
                  <p className="text-xs text-muted-editorial">
                    {currentSession?.role === 'practitioner'
                      ? `Account: ${currentSession.name}`
                      : 'Account: Administrator'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChangePasswordOpen(false)}
                className="p-1 rounded-lg text-muted-editorial hover:text-main cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {changePassError && (
              <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{changePassError}</span>
              </div>
            )}

            {changePassSuccess && (
              <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{changePassSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div>
                <label className="block text-muted-editorial font-medium mb-1">
                  Current Password *
                </label>
                <input
                  type="password"
                  required
                  value={currentPassInput}
                  onChange={(e) => setCurrentPassInput(e.target.value)}
                  placeholder="Enter current or initial standard password"
                  className="w-full px-3.5 py-2 rounded-xl border border-line bg-main text-main text-xs focus:outline-none focus:border-accent-editorial"
                />
              </div>

              <div>
                <label className="block text-muted-editorial font-medium mb-1">
                  New Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={4}
                  value={newPassInput}
                  onChange={(e) => setNewPassInput(e.target.value)}
                  placeholder="Enter new password (min. 4 characters)"
                  className="w-full px-3.5 py-2 rounded-xl border border-line bg-main text-main text-xs focus:outline-none focus:border-accent-editorial"
                />
              </div>

              <div>
                <label className="block text-muted-editorial font-medium mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={4}
                  value={confirmPassInput}
                  onChange={(e) => setConfirmPassInput(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2 rounded-xl border border-line bg-main text-main text-xs focus:outline-none focus:border-accent-editorial"
                />
              </div>

              <div className="pt-3 border-t border-line flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="px-4 py-2 rounded-full border border-line text-muted-editorial hover:text-main cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-accent-editorial text-white font-medium hover:opacity-90 cursor-pointer shadow-xs"
                >
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
