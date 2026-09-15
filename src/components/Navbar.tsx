import React, { useState } from 'react';
import { Theme } from '../types';
import { Sparkles, Lock } from 'lucide-react';

interface NavbarProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  activeView: string;
  onNavigate: (view: string, targetId?: string) => void;
  onOpenBooking: (serviceId?: string, practitionerId?: string) => void;
  onOpenContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTheme,
  onThemeChange,
  activeView,
  onNavigate,
  onOpenBooking,
  onOpenContact,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: string, targetId?: string) => {
    setMobileMenuOpen(false);
    onNavigate(view, targetId);
  };

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

          <button
            type="button"
            id="nav-link-workshops"
            onClick={() => handleNavClick('workshops')}
            className={`cursor-pointer transition-colors pb-1 ${
              activeView === 'workshops'
                ? 'text-accent-editorial border-b border-accent-editorial'
                : 'text-main hover:text-accent-editorial'
            }`}
          >
            Workshops
          </button>

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
            <button
              type="button"
              onClick={() => handleNavClick('workshops')}
              className="text-left py-1 text-main hover:text-accent-editorial cursor-pointer"
            >
              Workshops
            </button>

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
