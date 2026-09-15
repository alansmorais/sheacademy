import React from 'react';
import { Service, Practitioner, ReviewItem } from '../types';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Heart,
  Compass,
  Star,
  Users,
  Clock,
  Check,
  Quote,
} from 'lucide-react';

interface HomeViewProps {
  services: Service[];
  practitioners: Practitioner[];
  reviews: ReviewItem[];
  onOpenBooking: (serviceId?: string, practitionerId?: string) => void;
  onNavigateView: (view: 'home' | 'women' | 'men' | 'workshops' | 'admin') => void;
  onOpenFeedback: () => void;
  onOpenContact: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  services,
  practitioners,
  reviews,
  onOpenBooking,
  onNavigateView,
  onOpenFeedback,
  onOpenContact,
}) => {
  return (
    <div id="home-view" className="space-y-12 sm:space-y-16">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (EXACT MATCH TO SCREENSHOT 2) */}
      {/* ========================================================================= */}
      <section id="hero-section" className="pt-6 sm:pt-10 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Text Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Eyebrow */}
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-accent-editorial block">
                SEXUALITY &middot; HEALTH &middot; EMBODIMENT
              </span>

              {/* H1 Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-main leading-[1.05] tracking-tight">
                A conscious practice for the body you already live in.
              </h1>

              {/* Lead Paragraph */}
              <p className="text-sm sm:text-base lg:text-lg text-muted-editorial font-light leading-[1.6] max-w-xl">
                Conscious bodywork, intimacy, pelvic health, cycle-aware training and embodied care – supporting women and men through different stages, needs and experiences.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => onOpenBooking()}
                  className="px-6 py-3 rounded-xs text-[10px] uppercase tracking-[0.14em] font-semibold bg-[#32231F] text-[#FCFAF7] hover:bg-accent-editorial hover:text-white transition-colors cursor-pointer"
                >
                  BOOK A SESSION
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('pricing');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-xs border border-main text-[10px] uppercase tracking-[0.14em] font-semibold text-main hover:bg-[#32231F] hover:text-[#FCFAF7] transition-colors cursor-pointer"
                >
                  EXPLORE SERVICES
                </button>
              </div>
            </div>

            {/* Right Column: Beautiful Image + Simple Text Caption */}
            <div className="lg:col-span-5 space-y-3">
              <div className="w-full aspect-[4/5] sm:aspect-[4/5] lg:aspect-[4/5] rounded-xs overflow-hidden border border-line bg-alt shadow-xs">
                <img
                  src="https://raw.githubusercontent.com/alansmorais/she/main/images/hero-home.jpg"
                  alt="A quiet, consent-led practice"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <p className="text-[11px] sm:text-xs text-muted-editorial font-serif italic text-left pl-0.5">
                A quiet, consent-led practice
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. STATEMENT BANNER */}
      {/* ========================================================================= */}
      <section className="border-t border-line pt-8 pb-3 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-main leading-snug">
            A space for conscious bodywork, intimacy and individual care. Held in silence, dignity, and deep somatic
            respect.
          </h2>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. DUAL SECTIONS: FOR WOMEN & FOR MEN (STAGGERED EDITORIAL LAYOUT MATCHING SCREENSHOT 1) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-4">
        {/* Header Eyebrow & Title */}
        <div className="mb-8 sm:mb-10">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-accent-editorial block mb-2">
            INDIVIDUAL PATHS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-main leading-[1.1] tracking-tight">
            Different paths,<br />
            one intention.
          </h2>
        </div>

        <div className="space-y-12 lg:space-y-16">
          {/* Row 1: Seated Woman Image Left, For Women Text Right (Offset Down) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Image (Left) */}
            <div className="lg:col-span-7">
              <div className="w-full aspect-[4/3] rounded-xs overflow-hidden border border-line bg-alt shadow-xs">
                <img
                  src="https://raw.githubusercontent.com/alansmorais/she/main/images/for-women-seated.jpg"
                  alt="Somatic practice for women"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            {/* Text Block (Right - vertically centered or slightly offset on desktop) */}
            <div className="lg:col-span-5 lg:pl-6 space-y-4">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-accent-editorial block">
                FOR WOMEN
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-main font-normal leading-snug">
                Self-care, pelvic health, pregnancy, postpartum.
              </h3>
              <p className="text-xs sm:text-sm text-muted-editorial font-light leading-relaxed">
                Conscious bodywork rooted in sensitivity, pelvic health, relaxation, and support through the passages of motherhood – with individual consultations for whatever you are navigating.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigateView('women')}
                  className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-[0.15em] font-semibold text-main hover:text-accent-editorial border-b border-main hover:border-accent-editorial pb-1 transition-colors cursor-pointer"
                >
                  <span>EXPLORE SERVICES FOR WOMEN &rarr;</span>
                </button>
              </div>
            </div>
          </div>

          {/* Row 2: For Men Text Left, Bodywork Image Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Text Block (Left) */}
            <div className="order-2 lg:order-1 lg:col-span-5 lg:pr-6 space-y-4">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-accent-editorial block">
                FOR MEN
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-main font-normal leading-snug">
                Body awareness, pelvic health, conscious intimacy.
              </h3>
              <p className="text-xs sm:text-sm text-muted-editorial font-light leading-relaxed">
                A grounded, respectful space to work with tension, pelvic health, sensitivity, arousal and bodily responses – with individual support for men at any stage.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigateView('men')}
                  className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-[0.15em] font-semibold text-main hover:text-accent-editorial border-b border-main hover:border-accent-editorial pb-1 transition-colors cursor-pointer"
                >
                  <span>EXPLORE SERVICES FOR MEN &rarr;</span>
                </button>
              </div>
            </div>

            {/* Image (Right) */}
            <div className="order-1 lg:order-2 lg:col-span-7">
              <div className="w-full aspect-[4/3] rounded-xs overflow-hidden border border-line bg-alt shadow-xs">
                <img
                  src="https://raw.githubusercontent.com/alansmorais/she/main/images/for-men-massage.jpg"
                  alt="Somatic practice for men"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. WORKSHOPS PROMO BANNER */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xs border border-line bg-alt/60 p-6 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 shadow-xs">
          <div className="space-y-3 max-w-2xl">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-accent-editorial block">
              Group Immersions &bull; Copenhagen
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-main font-light leading-tight">
              Workshops & Intensive Immersions
            </h2>
            <p className="text-xs sm:text-sm text-muted-editorial font-light leading-relaxed">
              Explore our upcoming group containers in conscious touch, wheel of consent, men's pelvic vitality, and
              couples attunement. Small cohorts designed for safe, profound somatic discovery.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateView('workshops')}
            className="shrink-0 px-6 py-3 rounded-xs text-[11px] uppercase tracking-[0.13em] font-semibold bg-[#32231F] text-[#FCFAF7] hover:bg-accent-editorial hover:text-white transition-colors cursor-pointer flex items-center space-x-2"
          >
            <span>View All Workshops</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. AREAS OF SUPPORT / PRACTICE */}
      {/* ========================================================================= */}
      <section id="areas" className="border-t border-line pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-2">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-accent-editorial block">
              Areas of Practice
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-main leading-[1.05]">
              Four Pillars of Care
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 border border-line bg-card rounded-xs space-y-3 shadow-xs">
              <div className="w-8 h-8 rounded-full bg-alt flex items-center justify-center text-accent-editorial mb-3">
                <Heart className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-main font-normal">Somatic Bodywork</h3>
              <p className="text-xs sm:text-sm text-muted-editorial font-light leading-relaxed">
                Gentle myofascial release, pelvic de-armouring, and scar tissue restoration to release chronic guardedness.
              </p>
            </div>

            <div className="p-6 border border-line bg-card rounded-xs space-y-3 shadow-xs">
              <div className="w-8 h-8 rounded-full bg-alt flex items-center justify-center text-accent-editorial mb-3">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-main font-normal">Sexology & Intimacy</h3>
              <p className="text-xs sm:text-sm text-muted-editorial font-light leading-relaxed">
                Evidence-informed education around desire differences, boundary calibration, and relational communication.
              </p>
            </div>

            <div className="p-6 border border-line bg-card rounded-xs space-y-3 shadow-xs">
              <div className="w-8 h-8 rounded-full bg-alt flex items-center justify-center text-accent-editorial mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-main font-normal">Psychological Support</h3>
              <p className="text-xs sm:text-sm text-muted-editorial font-light leading-relaxed">
                Trauma-informed therapeutic dialogue addressing sexual anxiety, relationship attachment, and emotional integration.
              </p>
            </div>

            <div className="p-6 border border-line bg-card rounded-xs space-y-3 shadow-xs">
              <div className="w-8 h-8 rounded-full bg-alt flex items-center justify-center text-accent-editorial mb-3">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-main font-normal">Embodied Movement</h3>
              <p className="text-xs sm:text-sm text-muted-editorial font-light leading-relaxed">
                Diaphragmatic breath synchronization and pelvic floor conditioning for grounded daily vitality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. COMPLETE SERVICE PRICELIST (EXACT ALIGNMENT WITH SCREENSHOT 4) */}
      {/* ========================================================================= */}
      <section id="pricing" className="border-t border-line pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header row with Title and booking CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-line pb-6">
            <div className="space-y-1.5">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-accent-editorial block">
                Offerings & Pricing
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-main leading-[1.05]">
                Complete Service Pricelist
              </h2>
            </div>
            
            <button
              type="button"
              onClick={() => onOpenBooking()}
              className="px-6 py-3 rounded-xs text-[11px] uppercase tracking-[0.14em] font-semibold bg-[#32231F] text-[#FCFAF7] hover:bg-accent-editorial hover:text-white transition-colors cursor-pointer self-start sm:self-center"
            >
              BOOK AN APPOINTMENT
            </button>
          </div>

          {/* Grid Layout of 3 Editorial Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
            
            {/* Column 1: CONSCIOUS BODYWORK */}
            <div className="space-y-6">
              <h3 className="font-serif text-2xl text-main font-normal border-b border-line pb-3 tracking-wide flex items-center justify-between">
                <span>CONSCIOUS BODYWORK</span>
                <span className="text-[10px] uppercase font-sans tracking-widest text-muted-editorial font-light">(Women & Men)</span>
              </h3>
              
              <div className="divide-y divide-line/60">
                {/* Item 1 */}
                <div className="py-4 space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <button onClick={() => onOpenBooking('sensual-massage-2h')} className="font-serif text-base text-main hover:text-accent-editorial text-left transition-colors font-medium">
                      Full-Body Sensual Massage
                    </button>
                    <span className="font-mono text-xs sm:text-sm text-main font-medium shrink-0">2,990 / 3,990 kr</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-muted-editorial">
                    <span>2 hours / 3 hours</span>
                    <button onClick={() => onOpenBooking('sensual-massage-2h')} className="text-accent-editorial hover:underline uppercase tracking-wider text-[9px] font-semibold">Book &rarr;</button>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="py-4 space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <button onClick={() => onOpenBooking('de-armouring-2h')} className="font-serif text-base text-main hover:text-accent-editorial text-left transition-colors font-medium">
                      De-armouring
                    </button>
                    <span className="font-mono text-xs sm:text-sm text-main font-medium shrink-0">2,990 / 3,990 kr</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-muted-editorial">
                    <span>2 hours / 3 hours</span>
                    <button onClick={() => onOpenBooking('de-armouring-2h')} className="text-accent-editorial hover:underline uppercase tracking-wider text-[9px] font-semibold">Book &rarr;</button>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="py-4 space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <button onClick={() => onOpenBooking('pelvic-mapping-2h')} className="font-serif text-base text-main hover:text-accent-editorial text-left transition-colors font-medium">
                      Pelvic Area Mapping
                    </button>
                    <span className="font-mono text-xs sm:text-sm text-main font-medium shrink-0">2,990 / 3,990 kr</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-muted-editorial">
                    <span>2 hours / 3 hours</span>
                    <button onClick={() => onOpenBooking('pelvic-mapping-2h')} className="text-accent-editorial hover:underline uppercase tracking-wider text-[9px] font-semibold">Book &rarr;</button>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="py-4 space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <button onClick={() => onOpenBooking('pelvic-floor-2h')} className="font-serif text-base text-main hover:text-accent-editorial text-left transition-colors font-medium">
                      Pelvic Floor Work
                    </button>
                    <span className="font-mono text-xs sm:text-sm text-main font-medium shrink-0">2,990 / 3,990 kr</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-muted-editorial">
                    <span>2 hours / 3 hours</span>
                    <button onClick={() => onOpenBooking('pelvic-floor-2h')} className="text-accent-editorial hover:underline uppercase tracking-wider text-[9px] font-semibold">Book &rarr;</button>
                  </div>
                </div>

                {/* Item 5 */}
                <div className="py-4 space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <button onClick={() => onOpenBooking('individual-consultation')} className="font-serif text-base text-main hover:text-accent-editorial text-left transition-colors font-medium">
                      Individual Consultations
                    </button>
                    <span className="font-mono text-xs sm:text-sm text-main font-medium shrink-0">2,600 kr</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-muted-editorial">
                    <span>60–90 min</span>
                    <button onClick={() => onOpenBooking('individual-consultation')} className="text-accent-editorial hover:underline uppercase tracking-wider text-[9px] font-semibold">Book &rarr;</button>
                  </div>
                </div>

                {/* Item 6 */}
                <div className="py-4 space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <button onClick={() => onOpenBooking('mens-practices-2h')} className="font-serif text-base text-main hover:text-accent-editorial text-left transition-colors font-medium">
                      Men's Practices
                    </button>
                    <span className="font-mono text-xs sm:text-sm text-main font-medium shrink-0">2,990 / 3,990 kr</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-muted-editorial">
                    <span>Prostate, scars, erection (2h / 3h)</span>
                    <button onClick={() => onOpenBooking('mens-practices-2h')} className="text-accent-editorial hover:underline uppercase tracking-wider text-[9px] font-semibold">Book &rarr;</button>
                  </div>
                </div>

                {/* Item 7 */}
                <div className="py-4 space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <button onClick={() => onOpenBooking('face-massage-2h')} className="font-serif text-base text-main hover:text-accent-editorial text-left transition-colors font-medium">
                      Face Massage
                    </button>
                    <span className="font-mono text-xs sm:text-sm text-main font-medium shrink-0">2,900 kr</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-muted-editorial">
                    <span>2 hours session</span>
                    <button onClick={() => onOpenBooking('face-massage-2h')} className="text-accent-editorial hover:underline uppercase tracking-wider text-[9px] font-semibold">Book &rarr;</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: MATERNAL CARE */}
            <div className="space-y-6">
              <h3 className="font-serif text-2xl text-main font-normal border-b border-line pb-3 tracking-wide flex items-center justify-between">
                <span>MATERNAL CARE</span>
                <span className="text-[10px] uppercase font-sans tracking-widest text-muted-editorial font-light">(Pregnancy & Postpartum)</span>
              </h3>
              
              <div className="divide-y divide-line/60">
                {/* Item 1 */}
                <div className="py-4 space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <button onClick={() => onOpenBooking('pregnancy-massage-2h')} className="font-serif text-base text-main hover:text-accent-editorial text-left transition-colors font-medium">
                      Nurturing Pregnancy Massage
                    </button>
                    <span className="font-mono text-xs sm:text-sm text-main font-medium shrink-0">2,500 / 1,250 kr</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-muted-editorial">
                    <span>2 hours / 1 hour</span>
                    <button onClick={() => onOpenBooking('pregnancy-massage-2h')} className="text-accent-editorial hover:underline uppercase tracking-wider text-[9px] font-semibold">Book &rarr;</button>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="py-4 space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <button onClick={() => onOpenBooking('breathing-birth')} className="font-serif text-base text-main hover:text-accent-editorial text-left transition-colors font-medium">
                      Breathing Techniques for Birth
                    </button>
                    <span className="font-mono text-xs sm:text-sm text-main font-medium shrink-0">3,990 kr</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-muted-editorial">
                    <span>4 hours session (Partner joins)</span>
                    <button onClick={() => onOpenBooking('breathing-birth')} className="text-accent-editorial hover:underline uppercase tracking-wider text-[9px] font-semibold">Book &rarr;</button>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="py-4 space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <button onClick={() => onOpenBooking('massage-birth')} className="font-serif text-base text-main hover:text-accent-editorial text-left transition-colors font-medium">
                      Massage Techniques for Birth
                    </button>
                    <span className="font-mono text-xs sm:text-sm text-main font-medium shrink-0">3,990 kr</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-muted-editorial">
                    <span>4 hours session (Partner joins)</span>
                    <button onClick={() => onOpenBooking('massage-birth')} className="text-accent-editorial hover:underline uppercase tracking-wider text-[9px] font-semibold">Book &rarr;</button>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="py-4 space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <button onClick={() => onOpenBooking('ritual-before-birth')} className="font-serif text-base text-main hover:text-accent-editorial text-left transition-colors font-medium">
                      Ritual for a Woman Before Birth
                    </button>
                    <span className="font-mono text-xs sm:text-sm text-main font-medium shrink-0">2,900 kr</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-muted-editorial">
                    <span>4–6 hours (+300kr per guest)</span>
                    <button onClick={() => onOpenBooking('ritual-before-birth')} className="text-accent-editorial hover:underline uppercase tracking-wider text-[9px] font-semibold">Book &rarr;</button>
                  </div>
                </div>

                {/* Item 5 */}
                <div className="py-4 space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <button onClick={() => onOpenBooking('postpartum-massage-2h')} className="font-serif text-base text-main hover:text-accent-editorial text-left transition-colors font-medium">
                      Postpartum Massage / Scar Work
                    </button>
                    <span className="font-mono text-xs sm:text-sm text-main font-medium shrink-0">2,500 / 1,250 kr</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-muted-editorial">
                    <span>2 hours / 1 hour</span>
                    <button onClick={() => onOpenBooking('postpartum-massage-2h')} className="text-accent-editorial hover:underline uppercase tracking-wider text-[9px] font-semibold">Book &rarr;</button>
                  </div>
                </div>

                {/* Item 6 */}
                <div className="py-4 space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <button onClick={() => onOpenBooking('challenging-birth-consultation')} className="font-serif text-base text-main hover:text-accent-editorial text-left transition-colors font-medium">
                      Challenging Birth Consultation
                    </button>
                    <span className="font-mono text-xs sm:text-sm text-main font-medium shrink-0">2,990 kr</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-muted-editorial">
                    <span>3 hours deep consultation</span>
                    <button onClick={() => onOpenBooking('challenging-birth-consultation')} className="text-accent-editorial hover:underline uppercase tracking-wider text-[9px] font-semibold">Book &rarr;</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: TRAINING & NUTRITION */}
            <div className="space-y-6">
              <h3 className="font-serif text-2xl text-main font-normal border-b border-line pb-3 tracking-wide flex items-center justify-between">
                <span>TRAINING & NUTRITION</span>
                <span className="text-[10px] uppercase font-sans tracking-widest text-muted-editorial font-light">(Fitness & Coaching)</span>
              </h3>
              
              <div className="divide-y divide-line/60">
                {/* Item 1 */}
                <div className="py-4 space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <button onClick={() => onOpenBooking('personal-training')} className="font-serif text-base text-main hover:text-accent-editorial text-left transition-colors font-medium">
                      1:1 Personal Training
                    </button>
                    <span className="font-mono text-xs sm:text-sm text-main font-medium shrink-0">500 NOK</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-muted-editorial">
                    <span>60 minutes single session</span>
                    <button onClick={() => onOpenBooking('personal-training')} className="text-accent-editorial hover:underline uppercase tracking-wider text-[9px] font-semibold">Book &rarr;</button>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="py-4 space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <button onClick={() => onOpenBooking('personal-training-10x')} className="font-serif text-base text-main hover:text-accent-editorial text-left transition-colors font-medium">
                      10-Session Training Package
                    </button>
                    <span className="font-mono text-xs sm:text-sm text-main font-medium shrink-0">4,500 NOK</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-muted-editorial">
                    <span>10 &times; 60 min (Save 500 NOK)</span>
                    <button onClick={() => onOpenBooking('personal-training-10x')} className="text-accent-editorial hover:underline uppercase tracking-wider text-[9px] font-semibold">Book &rarr;</button>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="py-4 space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <button onClick={() => onOpenBooking('duo-training')} className="font-serif text-base text-main hover:text-accent-editorial text-left transition-colors font-medium">
                      Duo Training (2 People)
                    </button>
                    <span className="font-mono text-xs sm:text-sm text-main font-medium shrink-0">700 NOK</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-muted-editorial">
                    <span>60 min (350 NOK / person)</span>
                    <button onClick={() => onOpenBooking('duo-training')} className="text-accent-editorial hover:underline uppercase tracking-wider text-[9px] font-semibold">Book &rarr;</button>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="py-4 space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <button onClick={() => onOpenBooking('monthly-starter')} className="font-serif text-base text-main hover:text-accent-editorial text-left transition-colors font-medium">
                      Monthly Starter Package
                    </button>
                    <span className="font-mono text-xs sm:text-sm text-main font-medium shrink-0">1,800 NOK</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-muted-editorial">
                    <span>4 sessions/mo + Nutrition guidance</span>
                    <button onClick={() => onOpenBooking('monthly-starter')} className="text-accent-editorial hover:underline uppercase tracking-wider text-[9px] font-semibold">Book &rarr;</button>
                  </div>
                </div>

                {/* Item 5 */}
                <div className="py-4 space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <button onClick={() => onOpenBooking('training-plan')} className="font-serif text-base text-main hover:text-accent-editorial text-left transition-colors font-medium">
                      Training Plan / Meal Plan
                    </button>
                    <span className="font-mono text-xs sm:text-sm text-main font-medium shrink-0">600 / 700 NOK</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-muted-editorial">
                    <span>Customized 4–6 week programs</span>
                    <button onClick={() => onOpenBooking('training-plan')} className="text-accent-editorial hover:underline uppercase tracking-wider text-[9px] font-semibold">Book &rarr;</button>
                  </div>
                </div>

                {/* Item 6 */}
                <div className="py-4 space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <button onClick={() => onOpenBooking('combined-plan')} className="font-serif text-base text-main hover:text-accent-editorial text-left transition-colors font-medium">
                      Combined Plan
                    </button>
                    <span className="font-mono text-xs sm:text-sm text-main font-medium shrink-0">1,200 NOK</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-muted-editorial">
                    <span>Complete independent package</span>
                    <button onClick={() => onOpenBooking('combined-plan')} className="text-accent-editorial hover:underline uppercase tracking-wider text-[9px] font-semibold">Book &rarr;</button>
                  </div>
                </div>

                {/* Item 7 */}
                <div className="py-4 space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <button onClick={() => onOpenBooking('online-coaching')} className="font-serif text-base text-main hover:text-accent-editorial text-left transition-colors font-medium">
                      Online Coaching / VIP Package
                    </button>
                    <span className="font-mono text-xs sm:text-sm text-main font-medium shrink-0">1,200 / 2,500 NOK</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-muted-editorial">
                    <span>Regular check-ins & support</span>
                    <button onClick={() => onOpenBooking('online-coaching')} className="text-accent-editorial hover:underline uppercase tracking-wider text-[9px] font-semibold">Book &rarr;</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PRACTITIONERS (TEAM) */}
      {/* ========================================================================= */}
      <section id="about" className="border-t border-line pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-2">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-accent-editorial block">
              Our Faculty
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-main leading-[1.05]">
              Meet the Team
            </h2>
            <p className="text-xs sm:text-sm text-muted-editorial font-light max-w-xl">
              Each practitioner brings international certifications in somatic sexology, trauma-informed bodywork, and
              nervous system regulation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {practitioners
              .filter((p) => p.active)
              .map((p) => (
                <div
                  key={p.id}
                  className="rounded-xs border border-line bg-card overflow-hidden flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="aspect-square overflow-hidden bg-alt/30 flex items-center justify-center p-3">
                      <img
                        src={p.photo}
                        alt={p.name}
                        className="max-w-full max-h-full object-contain hover:scale-102 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 space-y-2.5">
                      <div>
                        <h3 className="font-serif text-2xl text-main font-normal">{p.name}</h3>
                        <p className="text-xs text-accent-editorial font-medium">{p.role}</p>
                      </div>
                      <p className="text-xs text-muted-editorial font-light leading-relaxed line-clamp-3">{p.bio}</p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      type="button"
                      onClick={() => onOpenBooking(undefined, p.id)}
                      className="w-full py-2.5 rounded-xs border border-line text-[10px] uppercase tracking-[0.13em] font-semibold text-main hover:bg-alt transition-colors cursor-pointer"
                    >
                      Book with {p.name.split(' ')[0]} &rarr;
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7.5. AREAS WE SUPPORT (EXACT RECONSTRUCTION) */}
      {/* ========================================================================= */}
      <section id="areas-we-support" className="border-t border-line pt-10 bg-alt/30 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-accent-editorial block">
                Areas We Support
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-main leading-[1.05]">
                How we can<br />
                <em className="italic text-accent-editorial">support you.</em>
              </h2>
              <p className="text-xs sm:text-sm text-muted-editorial font-light leading-relaxed">
                Whether you are seeking relief from physical discomfort, preparing for childbirth, or looking to optimize your physical strength and body composition, we offer dedicated, specialized containers tailored to your unique biology.
              </p>
              
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onOpenBooking()}
                  className="px-6 py-2.5 rounded-xs text-[10px] uppercase tracking-[0.13em] font-semibold bg-[#32231F] text-[#FCFAF7] hover:bg-accent-editorial hover:text-white transition-colors cursor-pointer"
                >
                  Book a Consultation
                </button>
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10">
              
              {/* Item 1 */}
              <div className="border-t border-line pt-4 space-y-2">
                <div className="flex items-baseline space-x-2.5">
                  <span className="text-[11px] font-semibold tracking-[0.15em] text-accent-editorial font-sans">
                    01
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl text-main font-normal leading-snug">
                    Pelvic Health & Sensitivity
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-muted-editorial font-light leading-relaxed">
                  Working with chronic pelvic tension, numbness, guarding, pain, and sensitivity issues within a slow, consensual, trauma-informed container.
                </p>
              </div>

              {/* Item 2 */}
              <div className="border-t border-line pt-4 space-y-2">
                <div className="flex items-baseline space-x-2.5">
                  <span className="text-[11px] font-semibold tracking-[0.15em] text-accent-editorial font-sans">
                    02
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl text-main font-normal leading-snug">
                    Somatic De-Armouring
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-muted-editorial font-light leading-relaxed">
                  Dissolving physical and emotional protective layers through gentle, progressive acupressure and focused somatic breathwork.
                </p>
              </div>

              {/* Item 3 */}
              <div className="border-t border-line pt-4 space-y-2">
                <div className="flex items-baseline space-x-2.5">
                  <span className="text-[11px] font-semibold tracking-[0.15em] text-accent-editorial font-sans">
                    03
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl text-main font-normal leading-snug">
                    Prenatal & Postpartum Healing
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-muted-editorial font-light leading-relaxed">
                  Supporting mothers through comfortable pregnancy massage, breathing mechanics, and postpartum scar care or pelvic integration.
                </p>
              </div>

              {/* Item 4 */}
              <div className="border-t border-line pt-4 space-y-2">
                <div className="flex items-baseline space-x-2.5">
                  <span className="text-[11px] font-semibold tracking-[0.15em] text-accent-editorial font-sans">
                    04
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl text-main font-normal leading-snug">
                    Arousal, Intimacy & Comfort
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-muted-editorial font-light leading-relaxed">
                  Coaching and bodywork for erectile difficulties, premature ejaculation, low libido, and building somatic intimacy confidence.
                </p>
              </div>

              {/* Item 5 */}
              <div className="border-t border-line pt-4 space-y-2">
                <div className="flex items-baseline space-x-2.5">
                  <span className="text-[11px] font-semibold tracking-[0.15em] text-accent-editorial font-sans">
                    05
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl text-main font-normal leading-snug">
                    Scar Tissue & Surgeries
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-muted-editorial font-light leading-relaxed">
                  Restoring mobility, circulation, and comfortable sensation to scars resulting from C-sections, pelvic surgeries, or physical injuries.
                </p>
              </div>

              {/* Item 6 */}
              <div className="border-t border-line pt-4 space-y-2">
                <div className="flex items-baseline space-x-2.5">
                  <span className="text-[11px] font-semibold tracking-[0.15em] text-accent-editorial font-sans">
                    06
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl text-main font-normal leading-snug">
                    Resilient Strength & Nutrition
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-muted-editorial font-light leading-relaxed">
                  Tailored personal training, duo fitness sessions, progressive plans, and meal strategies to foster sustainable, radiant vitality.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. NOT SURE WHERE TO BEGIN */}
      {/* ========================================================================= */}
      <section className="border-t border-line pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xs border border-line bg-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xs">
            <div className="lg:col-span-5 aspect-4/3 lg:aspect-auto lg:h-full bg-alt">
              <img
                src="https://raw.githubusercontent.com/alansmorais/she/main/images/not-sure-where-to-begin.jpg"
                alt="Guidance consultation"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-5">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-accent-editorial block">
                Where to begin
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-main leading-tight">
                Not sure where to <em className="italic text-accent-editorial">begin?</em>
              </h2>
              <p className="text-xs sm:text-sm text-muted-editorial font-light leading-relaxed">
                You do not need to know exactly which service is right for you before getting in touch. Tell us what you
                are experiencing, what you would like to understand, or what kind of support you are looking for — and we
                can help guide you toward a suitable practitioner and session.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => onOpenBooking('individual-consultation', 'daniela')}
                  className="px-6 py-3 rounded-xs text-[11px] uppercase tracking-[0.13em] font-semibold bg-[#32231F] text-[#FCFAF7] hover:bg-accent-editorial hover:text-white transition-colors cursor-pointer"
                >
                  Book a Session
                </button>
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="inline-flex items-center text-[10px] uppercase tracking-[0.15em] font-semibold text-main hover:text-accent-editorial border-b border-main hover:border-accent-editorial pb-1 transition-colors cursor-pointer self-center"
                >
                  Contact Us &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. CLIENT REFLECTIONS & REVIEWS */}
      {/* ========================================================================= */}
      <section className="border-t border-line py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line pb-6">
            <div className="space-y-1">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-accent-editorial block">
                Reflections
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-main leading-[1.05]">
                Client Experiences
              </h2>
            </div>

            <button
              type="button"
              onClick={onOpenFeedback}
              className="text-[10px] uppercase tracking-[0.15em] font-semibold text-accent-editorial hover:underline cursor-pointer flex items-center space-x-1"
            >
              <span>Share Your Reflection / View All &rarr;</span>
            </button>
          </div>

          {reviews.length === 0 ? (
            <div className="py-12 border border-line rounded-xs bg-card text-center space-y-4">
              <p className="text-sm text-muted-editorial font-light italic">
                No reflections have been shared yet. Be the first to share your experience with us.
              </p>
              <button
                type="button"
                onClick={onOpenFeedback}
                className="px-5 py-2.5 rounded-xs border border-line text-[10px] uppercase tracking-[0.14em] font-semibold text-main hover:bg-alt transition-colors cursor-pointer"
              >
                Share Your Reflection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  className="p-8 rounded-xs border border-line bg-card flex flex-col justify-between space-y-6 shadow-xs relative transition-all duration-300 hover:shadow-sm"
                >
                  <div className="space-y-4 relative">
                    <Quote className="absolute -top-3 -left-3 w-8 h-8 text-[#FAF3EC] -z-0 opacity-80" />
                    <div className="flex text-amber-500 relative z-10">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-editorial font-light leading-relaxed italic relative z-10">
                      "{r.text}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-line/50 text-xs relative z-10">
                    <span className="font-serif text-base text-main font-medium block">{r.author}</span>
                    <span className="text-[10px] text-muted-editorial block mt-0.5">
                      {r.serviceName} with <span className="text-accent-editorial font-medium">{r.practitionerName}</span>
                    </span>
                    {r.date && (
                      <span className="text-[9px] text-muted-editorial/70 block mt-1">{r.date}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
