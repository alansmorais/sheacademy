import React from 'react';
import { Service, Practitioner } from '../types';
import { Plus, ArrowRight } from 'lucide-react';

interface ForWomenViewProps {
  services: Service[];
  practitioners: Practitioner[];
  onOpenBooking: (serviceId?: string, practitionerId?: string) => void;
  onOpenContact?: (prefilledMessage?: string) => void;
}

export const ForWomenView: React.FC<ForWomenViewProps> = ({
  services,
  practitioners,
  onOpenBooking,
  onOpenContact,
}) => {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const selfCareServices = [
    {
      id: 'sensual-massage-2h',
      title: 'Full-Body Sensual Massage',
      desc: 'A slow, whole-body massage that returns you to your own sensitivity.',
    },
    {
      id: 'de-armouring-2h',
      title: 'De-armouring',
      desc: 'A gentle bodywork method for releasing long-held tension and reconnecting with the body.',
    },
    {
      id: 'pelvic-mapping-2h',
      title: 'Pelvic Area Mapping',
      desc: 'A gentle practice supporting awareness, sensitivity, and connection with the pelvic area.',
    },
    {
      id: 'pelvic-floor-2h',
      title: 'Pelvic Floor',
      desc: 'Conscious work with pelvic floor awareness, function, strength, and relaxation.',
    },
    {
      id: 'face-massage-women-2h',
      title: 'Face Massage',
      desc: 'Release tension, restore movement and reconnect with your face.',
    },
  ];

  const pregnancyServices = [
    {
      id: 'pregnancy-massage-2h',
      title: 'Nurturing Pregnancy Massage',
      desc: 'A gentle massage adapted to the changing needs of the pregnant body.',
    },
    {
      id: 'birth-breathing-2h',
      title: 'Breathing Techniques for Birth',
      desc: 'Practical breathing tools to meet the intensity of labour with more ease.',
    },
    {
      id: 'birth-massage-2h',
      title: 'Massage Techniques for Birth',
      desc: 'A session for you and your partner to learn hands-on support for labour.',
    },
    {
      id: 'birth-ritual-3h',
      title: 'Ritual for a Woman Before Birth',
      desc: 'A quiet, intentional session to honour the passage into motherhood.',
    },
  ];

  const postpartumServices = [
    {
      id: 'postpartum-massage-2h',
      title: 'Nurturing Postpartum Massage',
      desc: 'Restorative bodywork for the weeks and months after birth.',
    },
    {
      id: 'postpartum-scar-2h',
      title: 'Scar Work',
      desc: 'Gentle, conscious work with scar tissue after childbirth.',
    },
    {
      id: 'postpartum-massage-2h',
      title: 'Full-Body Massage',
      desc: 'Restorative bodywork for the weeks and months after birth.',
    },
    {
      id: 'challenging-birth-consult-1h',
      title: 'Consultation After a Challenging Birth',
      desc: 'A conversation to be met with care after a difficult birth experience.',
    },
  ];

  return (
    <div id="for-women-page" className="w-full text-main">
      {/* 1. HERO SECTION */}
      <section className="py-10 sm:py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-5 sm:space-y-6">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-accent-editorial block">
                For Women
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-main leading-[1.05]">
                Care for the body<br />
                through <em className="italic text-accent-editorial">different</em><br />
                stages of life.
              </h1>
              <p className="text-sm sm:text-base text-muted-editorial font-light leading-relaxed max-w-xl">
                Our work supports women in reconnecting with their bodies, releasing tension, developing sensitivity
                and awareness, building strength and conditioning, and receiving individual support through pregnancy,
                postpartum and other periods of change.
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="w-full h-72 sm:h-96 lg:h-[480px] rounded-xs overflow-hidden border border-line bg-alt shadow-xs">
                <img
                  id="women-hero-image"
                  src="https://raw.githubusercontent.com/alansmorais/she/main/images/for-women-DiDbh47K.jpg"
                  alt="Woman receiving back massage"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATEMENT SECTION */}
      <section className="border-t border-line py-10 sm:py-14 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-main leading-snug">
            A quiet, consent-led space to slow down, listen, and{' '}
            <em className="italic text-accent-editorial">meet the body</em> where it is — through every passage.
          </h2>
        </div>
      </section>

      {/* 3. FULL WIDTH IMAGE BEFORE TOC */}
      <div className="w-full h-64 sm:h-80 lg:h-[400px] overflow-hidden bg-alt border-y border-line">
        <img
          src="https://raw.githubusercontent.com/alansmorais/she/main/images/hands-supportive-contact.png"
          alt="Two hands reaching toward each other in a dark space"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* 4. TABLE OF CONTENTS GRID */}
      <section className="border-b border-line py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center gap-6 sm:gap-8 flex-wrap text-xs uppercase tracking-[0.15em] font-semibold text-muted-editorial">
            <a
              href="#self-care"
              onClick={(e) => scrollToSection(e, 'self-care')}
              className="hover:text-main transition-colors flex items-baseline space-x-1.5"
            >
              <span className="text-accent-editorial">01</span>
              <span>Self-care</span>
            </a>
            <a
              href="#training"
              onClick={(e) => scrollToSection(e, 'training')}
              className="hover:text-main transition-colors flex items-baseline space-x-1.5"
            >
              <span className="text-accent-editorial">02</span>
              <span>Training</span>
            </a>
            <a
              href="#pregnancy"
              onClick={(e) => scrollToSection(e, 'pregnancy')}
              className="hover:text-main transition-colors flex items-baseline space-x-1.5"
            >
              <span className="text-accent-editorial">03</span>
              <span>Pregnancy</span>
            </a>
            <a
              href="#postpartum"
              onClick={(e) => scrollToSection(e, 'postpartum')}
              className="hover:text-main transition-colors flex items-baseline space-x-1.5"
            >
              <span className="text-accent-editorial">04</span>
              <span>Postpartum Care</span>
            </a>
            <a
              href="#year-long"
              onClick={(e) => scrollToSection(e, 'year-long')}
              className="hover:text-main transition-colors flex items-baseline space-x-1.5"
            >
              <span className="text-accent-editorial">05</span>
              <span>Year-long Program</span>
            </a>
            <a
              href="#consultations"
              onClick={(e) => scrollToSection(e, 'consultations')}
              className="hover:text-main transition-colors flex items-baseline space-x-1.5"
            >
              <span className="text-accent-editorial">06</span>
              <span>Individual Consultations</span>
            </a>
          </div>
        </div>
      </section>

      {/* 5. SERVICES SECTIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 space-y-16 lg:space-y-20">
        {/* 01 SELF-CARE */}
        <div id="self-care" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-accent-editorial block">
              01 &middot; Self-care
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-main leading-[1.05]">
              A space for<br />
              slowing down.
            </h2>
            <div className="text-xs sm:text-sm text-muted-editorial font-light leading-relaxed space-y-3 max-w-md">
              <p>A space for slowing down, releasing tension, and reconnecting with your body.</p>
              <p>
                These services are suitable for women who want to reconnect with their bodies, reduce tension, and
                support their sensitivity and vitality.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 divide-y divide-line border-t border-line">
            {selfCareServices.map((item) => (
              <div
                key={item.id + item.title}
                onClick={() => onOpenBooking(item.id)}
                className="py-6 group cursor-pointer transition-colors hover:bg-alt/20 -mx-4 px-4 rounded-xs"
              >
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h4 className="font-serif text-xl sm:text-2xl text-main font-normal group-hover:text-accent-editorial transition-colors">
                    {item.title}
                  </h4>
                  <span className="text-2xl font-light text-accent-editorial leading-none shrink-0 group-hover:rotate-45 transition-transform">
                    +
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-editorial font-light leading-relaxed max-w-xl">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 02 TRAINING BANNER */}
        <div className="w-full h-64 sm:h-80 lg:h-[400px] overflow-hidden bg-alt border border-line rounded-xs">
          <img
            src="https://raw.githubusercontent.com/alansmorais/she/main/images/cycle-aware-training.jpg"
            alt="Woman in athletic wear stretching"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* 02 TRAINING */}
        <div id="training" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-accent-editorial block">
              02 &middot; Training
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-main leading-[1.05]">
              Train with your body,<br />
              not against it.
            </h2>
            <div className="text-xs sm:text-sm text-muted-editorial font-light leading-relaxed space-y-3 max-w-md">
              <p>
                Strength, conditioning and nutritional guidance attuned to your individual physiology, goals and
                menstrual cycle.
              </p>
              <p>
                A process-based approach for women who want training that adapts as their body, capacity and goals
                change.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 border-t border-line">
            <div
              onClick={() => onOpenBooking('personal-training')}
              className="py-6 group cursor-pointer transition-colors hover:bg-alt/20 -mx-4 px-4 rounded-xs"
            >
              <div className="flex justify-between items-start gap-4 mb-2">
                <h4 className="font-serif text-xl sm:text-2xl text-main font-normal group-hover:text-accent-editorial transition-colors">
                  Cycle-Aware Training
                </h4>
                <span className="text-2xl font-light text-accent-editorial leading-none shrink-0 group-hover:rotate-45 transition-transform">
                  +
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-editorial font-light leading-relaxed max-w-xl">
                Strength. Conditioning. Nutrition. Training that adapts to you — not the other way around.
              </p>
            </div>
          </div>
        </div>

        {/* 03 PREGNANCY BANNER */}
        <div className="w-full h-64 sm:h-80 lg:h-[400px] overflow-hidden bg-alt border border-line rounded-xs">
          <img
            src="https://raw.githubusercontent.com/alansmorais/she/main/images/pregnancy.jpg"
            alt="Close up of hands gently massaging a pregnant belly"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* 03 PREGNANCY */}
        <div id="pregnancy" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-accent-editorial block">
              03 &middot; Pregnancy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-main leading-[1.05]">
              The months<br />
              before birth.
            </h2>
            <div className="text-xs sm:text-sm text-muted-editorial font-light leading-relaxed space-y-3 max-w-md">
              <p>Attentive bodywork for the months before birth.</p>
              <p>
                Attentive bodywork and preparation for the months leading to birth — held with care for you and your baby.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 divide-y divide-line border-t border-line">
            {pregnancyServices.map((item) => (
              <div
                key={item.id + item.title}
                onClick={() => onOpenBooking(item.id)}
                className="py-6 group cursor-pointer transition-colors hover:bg-alt/20 -mx-4 px-4 rounded-xs"
              >
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h4 className="font-serif text-xl sm:text-2xl text-main font-normal group-hover:text-accent-editorial transition-colors">
                    {item.title}
                  </h4>
                  <span className="text-2xl font-light text-accent-editorial leading-none shrink-0 group-hover:rotate-45 transition-transform">
                    +
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-editorial font-light leading-relaxed max-w-xl">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 04 POSTPARTUM BANNER */}
        <div className="w-full h-64 sm:h-80 lg:h-[400px] overflow-hidden bg-alt border border-line rounded-xs">
          <img
            src="https://raw.githubusercontent.com/alansmorais/she/main/images/mother-baby.jpg"
            alt="Mother holding newborn baby close"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* 04 POSTPARTUM CARE */}
        <div id="postpartum" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-accent-editorial block">
              04 &middot; Postpartum Care
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-main leading-[1.05]">
              After birth,<br />
              at your own pace.
            </h2>
            <div className="text-xs sm:text-sm text-muted-editorial font-light leading-relaxed space-y-3 max-w-md">
              <p>Restorative sessions for the days, weeks and months after birth, at your own pace.</p>
              <p className="italic text-accent-editorial">
                Some postpartum sessions can be attended with a baby — please mention this when booking so we can
                prepare the space accordingly.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 divide-y divide-line border-t border-line">
            {postpartumServices.map((item) => (
              <div
                key={item.id + item.title}
                onClick={() => onOpenBooking(item.id)}
                className="py-6 group cursor-pointer transition-colors hover:bg-alt/20 -mx-4 px-4 rounded-xs"
              >
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h4 className="font-serif text-xl sm:text-2xl text-main font-normal group-hover:text-accent-editorial transition-colors">
                    {item.title}
                  </h4>
                  <span className="text-2xl font-light text-accent-editorial leading-none shrink-0 group-hover:rotate-45 transition-transform">
                    +
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-editorial font-light leading-relaxed max-w-xl">
                  {item.desc}
                </p>
              </div>
            ))}

            {/* Pelvic Area Mapping (Postpartum) */}
            <div className="py-6 group">
              <div
                onClick={() => onOpenBooking('pelvic-mapping-2h')}
                className="cursor-pointer transition-colors hover:bg-alt/20 -mx-4 px-4 py-2 rounded-xs"
              >
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h4 className="font-serif text-xl sm:text-2xl text-main font-normal group-hover:text-accent-editorial transition-colors">
                    Pelvic Area Mapping
                  </h4>
                  <span className="text-2xl font-light text-accent-editorial leading-none shrink-0 group-hover:rotate-45 transition-transform">
                    +
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-editorial font-light leading-relaxed max-w-xl">
                  A gentle return to the pelvic area after birth, at your own pace — the same practice introduced in
                  Self-care, adapted for postpartum.
                </p>
              </div>
              <div className="mt-2">
                <a
                  href="#self-care"
                  onClick={(e) => scrollToSection(e, 'self-care')}
                  className="inline-flex items-center space-x-1 text-[10px] uppercase tracking-[0.15em] font-semibold text-main border-b border-main pb-0.5 hover:text-accent-editorial hover:border-accent-editorial transition-colors"
                >
                  <span>See in Self-care</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. 05 YEAR-LONG PROGRAM (DARK THEME CONTAINER) */}
      <section id="year-long" className="scroll-mt-24 mt-16 lg:mt-24 bg-[#231815] text-[#F5EFE9] py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#BAACA3] block">
                Year-long program for women
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#F5EFE9] leading-[1.05]">
                Feminine &amp; <em className="italic text-[#B05B43]">Vital</em> Essence
              </h2>
              <div className="text-xs sm:text-sm text-[#BAACA3] font-light leading-relaxed space-y-2 max-w-xl">
                <p>
                  A year-long program of gatherings focused on bodywork, awareness, and sharing in a women’s circle.
                </p>
                <p>A space for pause, regeneration, and connection with yourself.</p>
              </div>
              <p className="italic text-[#B05B43] text-sm pt-2">
                Imbolc &middot; Beltane &middot; Lughnasad &middot; Samhain
              </p>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <img
                src="https://raw.githubusercontent.com/alansmorais/she/main/images/cycle-diagram.png"
                alt="Cyclical phases diagram"
                className="max-w-[240px] w-full opacity-80"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-[#F5EFE9]/15">
            <div className="space-y-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#BAACA3] block">
                Part 01
              </span>
              <h4 className="font-serif text-2xl text-[#F5EFE9] font-normal">Imbolc</h4>
              <p className="text-[11px] uppercase tracking-[0.1em] font-semibold text-[#F5EFE9]">
                Roots, beginnings &amp; self-awareness
              </p>
              <p className="text-xs text-[#BAACA3] font-light leading-relaxed">
                A gathering focused on your roots, early experiences, and the patterns that shape the way you relate
                to yourself and others. Through body awareness, reflection, and sharing, we explore connection with
                the inner child, emotional needs, and the foundations from which we grow.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#BAACA3] block">
                Part 02
              </span>
              <h4 className="font-serif text-2xl text-[#F5EFE9] font-normal">Beltane</h4>
              <p className="text-[11px] uppercase tracking-[0.1em] font-semibold text-[#F5EFE9]">
                Sexuality, boundaries &amp; self-acceptance
              </p>
              <p className="text-xs text-[#BAACA3] font-light leading-relaxed">
                A space to explore sexuality, self-acceptance, desire, and personal boundaries. We work with body
                awareness and conscious communication, opening space for a more authentic relationship with your
                sensuality, your needs, and your capacity to say both yes and no.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#BAACA3] block">
                Part 03
              </span>
              <h4 className="font-serif text-2xl text-[#F5EFE9] font-normal">Lughnasad</h4>
              <p className="text-[11px] uppercase tracking-[0.1em] font-semibold text-[#F5EFE9]">
                Body, creation &amp; feminine strength
              </p>
              <p className="text-xs text-[#BAACA3] font-light leading-relaxed">
                A gathering dedicated to the changing female body, creativity, motherhood, and the many ways feminine
                strength can be experienced. We explore our relationship with the body, its cycles and transitions,
                while creating space to reconnect with vitality, pleasure, and our own creative power.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#BAACA3] block">
                Part 04
              </span>
              <h4 className="font-serif text-2xl text-[#F5EFE9] font-normal">Samhain</h4>
              <p className="text-[11px] uppercase tracking-[0.1em] font-semibold text-[#F5EFE9]">
                Maturity, wisdom &amp; transition
              </p>
              <p className="text-xs text-[#BAACA3] font-light leading-relaxed">
                A space dedicated to maturity, change, and the wisdom carried through lived experience. We explore
                ageing, menopause, sensuality, and our relationship with endings and transitions — with an invitation to
                meet the changing body with curiosity, acceptance, and respect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. 06 INDIVIDUAL CONSULTATIONS */}
      <section id="consultations" className="scroll-mt-24 py-14 lg:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-3">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-accent-editorial block">
                06 &middot; Individual Consultations
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-main leading-[1.05]">
                Not sure<br />
                where to begin?
              </h2>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <p className="text-sm sm:text-base text-muted-editorial font-light leading-relaxed">
                A quieter format for women who are unsure which service to choose, who are navigating a period of
                change or challenge, or who wish to discuss topics related to the body, intimacy or awareness.
              </p>
              <p className="italic text-accent-editorial text-sm">
                Available in person and online.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onOpenBooking('individual-consultation-1h')}
                  className="inline-flex items-center justify-center border border-[#32231F] px-6 py-3 min-h-[44px] uppercase tracking-[0.13em] text-[11px] font-semibold bg-[#32231F] text-[#FCFAF7] hover:bg-accent-editorial hover:border-accent-editorial hover:text-white transition-all cursor-pointer shadow-xs rounded-xs"
                >
                  Book a Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SAFETY & CONSENT */}
      <section id="safety" className="scroll-mt-24 py-12 lg:py-16 bg-alt/60 border-t border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-accent-editorial block mb-2">
              Safety &amp; Consent
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-main leading-[1.05]">
              Professional bodywork,<br />
              held with care.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 pt-6 border-t border-line">
            <div className="space-y-2">
              <span className="text-[11px] font-semibold tracking-[0.15em] text-accent-editorial block">01</span>
              <p className="text-xs sm:text-sm text-main font-medium leading-relaxed">
                Every session begins with a conversation.
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-[11px] font-semibold tracking-[0.15em] text-accent-editorial block">02</span>
              <p className="text-xs sm:text-sm text-main font-medium leading-relaxed">
                Boundaries are defined together, before any bodywork begins.
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-[11px] font-semibold tracking-[0.15em] text-accent-editorial block">03</span>
              <p className="text-xs sm:text-sm text-main font-medium leading-relaxed">
                All bodywork is consent-led — nothing happens without your agreement.
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-[11px] font-semibold tracking-[0.15em] text-accent-editorial block">04</span>
              <p className="text-xs sm:text-sm text-main font-medium leading-relaxed">
                You can pause, adjust or stop the session at any moment.
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-[11px] font-semibold tracking-[0.15em] text-accent-editorial block">05</span>
              <p className="text-xs sm:text-sm text-main font-medium leading-relaxed">
                Intimate bodywork is professional bodywork and is not an erotic service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. BOTTOM CTA */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-xs border border-line bg-alt/50 text-center space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl text-main font-light leading-snug">
              Not sure which service is right for you?
            </h2>
            <p className="text-xs sm:text-sm text-muted-editorial font-light leading-relaxed max-w-xl mx-auto">
              You do not need to decide before getting in touch. Tell us what you are looking for, and we can help guide
              you toward a suitable service and practitioner.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onOpenBooking()}
                className="inline-flex items-center justify-center border border-[#32231F] px-6 py-3 min-h-[44px] uppercase tracking-[0.13em] text-[11px] font-semibold bg-[#32231F] text-[#FCFAF7] hover:bg-accent-editorial hover:border-accent-editorial hover:text-white transition-all cursor-pointer shadow-xs rounded-xs"
              >
                Book a Session
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onOpenContact) {
                    onOpenContact();
                  } else {
                    onOpenBooking();
                  }
                }}
                className="inline-flex items-center justify-center border border-main px-6 py-3 min-h-[44px] uppercase tracking-[0.13em] text-[11px] font-semibold bg-transparent text-main hover:bg-main hover:text-[#FCFAF7] transition-all cursor-pointer rounded-xs"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
