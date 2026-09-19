import React, { useState, useRef, useEffect } from 'react';
import { Theme, Workshop } from '../types';
import { Sparkles, Lock, ChevronDown, ArrowRight } from 'lucide-react';
import { INITIAL_WORKSHOPS } from '../data/initialData';

interface NavbarProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  activeView: string;
  onNavigate: (view: string, targetId?: string) => void;
  onOpenBooking: (serviceId?: string, practitionerId?: string) => void;
  onOpenContact: () => void;
  workshops?: Workshop[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTheme,
  onThemeChange,
  activeView,
  onNavigate,
  onOpenBooking,
  onOpenContact,
  workshops,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [workshopsDropdownOpen, setWorkshopsDropdownOpen] = useState(false);
  const [mobileWorkshopsOpen, setMobileWorkshopsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const workshopsList = workshops && workshops.length > 0 ? workshops : INITIAL_WORKSHOPS;

  const handleNavClick = (view: string, targetId?: string) => {
    setMobileMenuOpen(false);
    setWorkshopsDropdownOpen(false);
    onNavigate(view, targetId);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setWorkshopsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 w-full border-b border-line bg-header backdrop-blur-md transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Exact Brand Logo System from Original HTML */}
        <button
          type="button"
          id="brand-logo-btn"
          onClick={() => handleNavClick('home')}
          className="flex flex-col items-start cursor-pointer text-left group"
          aria-label="SHE. academy home"
        >
          <div className="flex items-baseline leading-none">
            <span className="font-serif text-3xl sm:text-4xl text-main font-normal tracking-wide">SHE</span>
            <span className="text-3xl sm:text-4xl font-bold text-accent-editorial">.</span>
            <span className="text-xs sm:text-sm font-medium text-accent-editorial tracking-wider ml-1.5 font-sans">
              academy
            </span>
          </div>
          <div className="text-[7.5px] sm:text-[8px] uppercase tracking-[0.32em] text-main font-sans mt-0.5 ml-0.5 flex items-center opacity-85">
            Sexuality <span className="text-accent-editorial mx-1.5 font-bold">&bull;</span> Health{' '}
            <span className="text-accent-editorial mx-1.5 font-bold">&bull;</span> Embodiment
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav id="desktop-nav" className="hidden lg:flex items-center space-x-6 text-[11px] uppercase tracking-[0.12em] font-semibold">
          <button
            type="button"
            id="nav-link-for-women"
            onClick={() => handleNavClick('women')}
            className={`cursor-pointer transition-colors pb-1 ${
              activeView === 'women'
                ? 'text-accent-editorial border-b border-accent-editorial'
                : 'text-main hover:text-accent-editorial'
            }`}
          >
            For Women
          </button>

          <button
            type="button"
            id="nav-link-for-men"
            onClick={() => handleNavClick('men')}
            className={`cursor-pointer transition-colors pb-1 ${
              activeView === 'men'
                ? 'text-accent-editorial border-b border-accent-editorial'
                : 'text-main hover:text-accent-editorial'
            }`}
          >
            For Men
          </button>

          {/* Workshops with Dropdown */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setWorkshopsDropdownOpen(true)}
            onMouseLeave={() => setWorkshopsDropdownOpen(false)}
          >
            <button
              type="button"
              id="nav-link-workshops"
              onClick={() => {
                handleNavClick('workshops');
                setWorkshopsDropdownOpen(false);
              }}
              className={`cursor-pointer transition-colors pb-1 inline-flex items-center space-x-1 ${
                activeView === 'workshops'
                  ? 'text-accent-editorial border-b border-accent-editorial'
                  : 'text-main hover:text-accent-editorial'
              }`}
            >
              <span>Workshops</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  workshopsDropdownOpen ? 'rotate-180 text-accent-editorial' : 'opacity-70'
                }`}
              />
            </button>

            {/* Desktop Workshops Dropdown Menu */}
            {workshopsDropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                <div className="w-88 sm:w-[420px] rounded-2xl border border-line bg-card shadow-2xl p-3 text-left normal-case tracking-normal">
                  <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-line px-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-editorial">
                      Workshops Calendar ({workshopsList.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        handleNavClick('workshops');
                        setWorkshopsDropdownOpen(false);
                      }}
                      className="text-[10px] font-semibold uppercase tracking-wider text-accent-editorial hover:underline cursor-pointer flex items-center space-x-1"
                    >
                      <span>View All</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  <div className="max-h-[360px] overflow-y-auto space-y-1 pr-1">
                    {workshopsList.map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => {
                          handleNavClick('workshops', w.id);
                          setWorkshopsDropdownOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-alt/70 transition-colors flex items-start space-x-2.5 group cursor-pointer"
                      >
                        <span className="mt-0.5 px-2 py-0.5 rounded-md bg-alt text-[10px] font-mono font-medium text-accent-editorial whitespace-nowrap border border-line shrink-0">
                          {w.date}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-serif text-main font-medium group-hover:text-accent-editorial transition-colors leading-snug">
                            {w.title}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            id="nav-link-pricelist"
            onClick={() => handleNavClick('home', 'pricing')}
            className="cursor-pointer text-main hover:text-accent-editorial transition-colors pb-1"
          >
            Pricelist
          </button>

          <button
            type="button"
            id="nav-link-areas"
            onClick={() => handleNavClick('home', 'areas')}
            className="cursor-pointer text-main hover:text-accent-editorial transition-colors pb-1"
          >
            Areas
          </button>

          <button
            type="button"
            id="nav-link-team"
            onClick={() => handleNavClick('home', 'about')}
            className="cursor-pointer text-main hover:text-accent-editorial transition-colors pb-1"
          >
            Team
          </button>

          <button
            type="button"
            id="nav-link-contact"
            onClick={onOpenContact}
            className="cursor-pointer text-main hover:text-accent-editorial transition-colors pb-1"
          >
            Contact
          </button>

          <button
            type="button"
            id="nav-link-book"
            onClick={() => onOpenBooking()}
            className="border border-main px-4 py-2 text-main hover:bg-main hover:text-card transition-colors cursor-pointer"
          >
            Book a Session
          </button>

          <button
            type="button"
            id="header-admin-link"
            onClick={() => handleNavClick('admin')}
            className={`p-2 rounded-xs border border-line text-muted-editorial hover:text-main hover:border-main transition-colors cursor-pointer ${
              activeView === 'admin' ? 'text-accent-editorial border-accent-editorial' : ''
            }`}
            title="Admin Sanctuary"
            aria-label="Admin Sanctuary"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </nav>

        {/* Mobile Hamburger Menu Icon (matching screenshot & original HTML: ☰) */}
        <div className="flex lg:hidden items-center space-x-3">
          <button
            type="button"
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-2xl text-main bg-transparent border-0 cursor-pointer p-1"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobileNav"
          className="lg:hidden bg-main border-t border-line px-5 py-4 space-y-3"
        >
          <div className="grid grid-cols-1 gap-3 text-xs uppercase tracking-[0.12em] font-semibold">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className="text-left py-1 text-main hover:text-accent-editorial cursor-pointer"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('women')}
              className="text-left py-1 text-main hover:text-accent-editorial cursor-pointer"
            >
              For Women
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('men')}
              className="text-left py-1 text-accent-editorial cursor-pointer"
            >
              For Men
            </button>
            {/* Workshops Link with Expandable Sub-Menu */}
            <div className="border-y border-line/40 py-1 my-0.5">
              <div className="flex items-center justify-between py-1">
                <button
                  type="button"
                  onClick={() => handleNavClick('workshops')}
                  className={`text-left text-xs uppercase tracking-[0.12em] font-semibold cursor-pointer ${
                    activeView === 'workshops' ? 'text-accent-editorial' : 'text-main hover:text-accent-editorial'
                  }`}
                >
                  Workshops ({workshopsList.length})
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileWorkshopsOpen(!mobileWorkshopsOpen);
                  }}
                  className="p-1 text-muted-editorial hover:text-accent-editorial cursor-pointer"
                  aria-label="Toggle workshops list"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileWorkshopsOpen ? 'rotate-180 text-accent-editorial' : ''
                    }`}
                  />
                </button>
              </div>

              {mobileWorkshopsOpen && (
                <div className="pl-2 space-y-2 pt-1 pb-2 border-l border-line/60 ml-1">
                  {workshopsList.map((w) => (
                    <button
                      key={`mobile-${w.id}`}
                      type="button"
                      onClick={() => handleNavClick('workshops', w.id)}
                      className="w-full text-left py-1 text-xs text-muted-editorial hover:text-accent-editorial flex flex-col cursor-pointer"
                    >
                      <span className="text-[10px] font-mono text-accent-editorial font-medium">{w.date}</span>
                      <span className="font-serif text-xs text-main font-medium">{w.title}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleNavClick('workshops')}
                    className="w-full text-left pt-1.5 text-[11px] text-accent-editorial font-bold uppercase tracking-wider cursor-pointer"
                  >
                    View All Workshops &rarr;
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleNavClick('home', 'pricing')}
              className="text-left py-1 text-main hover:text-accent-editorial cursor-pointer"
            >
              Pricelist
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('home', 'areas')}
              className="text-left py-1 text-main hover:text-accent-editorial cursor-pointer"
            >
              Areas
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('home', 'about')}
              className="text-left py-1 text-main hover:text-accent-editorial cursor-pointer"
            >
              Team
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="text-left py-1 text-main hover:text-accent-editorial cursor-pointer"
            >
              Contact
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('admin')}
              className="text-left py-1 text-muted-editorial hover:text-main flex items-center space-x-1.5 cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Sanctuary</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="text-left py-2 text-accent-editorial font-bold tracking-widest cursor-pointer"
            >
              Book a Session &rarr;
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
