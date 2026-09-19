import React from 'react';
import { Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, targetId?: string) => void;
  onOpenBooking: (serviceId?: string) => void;
  onOpenFeedback: () => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenBooking,
  onOpenFeedback,
  onOpenContact,
}) => {
  return (
    <footer id="main-footer" className="bg-alt pt-12 pb-8 border-t border-line transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Column 1: Brand & CTA */}
          <div className="space-y-4">
            <div className="flex flex-col items-start">
              <div className="flex items-baseline leading-none">
                <span className="font-serif text-3xl text-main font-normal tracking-wide">SHE</span>
                <span className="text-3xl font-bold text-accent-editorial">.</span>
              </div>
              <div className="text-[7.5px] uppercase tracking-[0.32em] text-main font-sans mt-0.5 ml-0.5 opacity-85">
                Sexuality <span className="text-accent-editorial mx-1 font-bold">&bull;</span> Health{' '}
                <span className="text-accent-editorial mx-1 font-bold">&bull;</span> Embodiment
              </div>
            </div>

            <p className="text-xs text-muted-editorial leading-relaxed max-w-[280px]">
              A space for conscious bodywork, intimacy and individual care.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onOpenBooking()}
                className="px-3.5 py-1.5 rounded-xs border border-main text-[9px] uppercase tracking-[0.13em] font-semibold text-main hover:bg-main hover:text-card transition-colors cursor-pointer"
              >
                Book a Session
              </button>
            </div>
          </div>

          {/* Column 2: Navigate */}
          <div className="space-y-3">
            <h4 className="font-sans text-[10px] uppercase tracking-[0.18em] font-semibold text-main">
              Navigate
            </h4>
            <div className="grid gap-2 text-xs text-muted-editorial">
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="text-left hover:text-main transition-colors cursor-pointer"
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => onNavigate('women')}
                className="text-left hover:text-main transition-colors cursor-pointer"
              >
                For Women
              </button>
              <button
                type="button"
                onClick={() => onNavigate('men')}
                className="text-left hover:text-main transition-colors cursor-pointer"
              >
                For Men
              </button>
              <button
                type="button"
                onClick={() => onNavigate('workshops')}
                className="text-left hover:text-main transition-colors cursor-pointer"
              >
                Workshops
              </button>

              <button
                type="button"
                onClick={() => onNavigate('home', 'pricing')}
                className="text-left hover:text-main transition-colors cursor-pointer"
              >
                Pricing
              </button>
              <button
                type="button"
                onClick={() => onNavigate('home', 'about')}
                className="text-left hover:text-main transition-colors cursor-pointer"
              >
                About Us
              </button>
              <button
                type="button"
                onClick={onOpenContact}
                className="text-left hover:text-main transition-colors cursor-pointer"
              >
                Contact
              </button>
            </div>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-3">
            <h4 className="font-sans text-[10px] uppercase tracking-[0.18em] font-semibold text-main">
              Contact
            </h4>
            <div className="grid gap-2 text-xs text-muted-editorial">
              <button
                type="button"
                onClick={onOpenContact}
                className="text-left hover:text-main transition-colors cursor-pointer"
              >
                Get in touch
              </button>
              <button
                type="button"
                onClick={() => onOpenBooking()}
                className="text-left hover:text-main transition-colors cursor-pointer"
              >
                Book a Session
              </button>
              <a href="tel:+4746817511" className="hover:text-main transition-colors">
                +47 468 17 511
              </a>
              <button
                type="button"
                onClick={onOpenFeedback}
                className="text-left text-accent-editorial hover:underline pt-1 cursor-pointer"
              >
                Leave Client Feedback &rarr;
              </button>
            </div>
          </div>

          {/* Column 4: Follow & Legal */}
          <div className="space-y-3">
            <h4 className="font-sans text-[10px] uppercase tracking-[0.18em] font-semibold text-main">
              Follow
            </h4>
            <div className="grid gap-2 text-xs text-muted-editorial">
              <a href="#" className="hover:text-main transition-colors">
                Instagram
              </a>
              <a href="#" className="hover:text-main transition-colors">
                Facebook
              </a>

              <h4 className="font-sans text-[10px] uppercase tracking-[0.18em] font-semibold text-main pt-4">
                Legal & Admin
              </h4>
              <a href="#" className="hover:text-main transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-main transition-colors">
                Terms &amp; Conditions
              </a>
              <button
                type="button"
                onClick={() => onNavigate('admin')}
                className="text-left hover:text-main flex items-center space-x-1 cursor-pointer pt-1"
              >
                <Lock className="w-3 h-3 text-accent-editorial" />
                <span>Admin Sanctuary</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom Line */}
        <div className="pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-muted-editorial tracking-wider">
          <span>&copy; 2026 ASM Solutions. All rights reserved.</span>
          <span>SHE. academy</span>
        </div>
      </div>
    </footer>
  );
};
