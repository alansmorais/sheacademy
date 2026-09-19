import React from 'react';
import { Service, Practitioner } from '../types';

interface ForMenViewProps {
  services: Service[];
  practitioners: Practitioner[];
  onOpenBooking: (serviceId?: string, practitionerId?: string) => void;
  onOpenContact: () => void;
}

export const ForMenView: React.FC<ForMenViewProps> = ({
  services,
  practitioners,
  onOpenBooking,
  onOpenContact,
}) => {
  const supportItems = [
    {
      num: '01',
      title: 'Erectile difficulties',
      desc: 'Working with tension, breath and attention rather than performance.',
    },
    {
      num: '02',
      title: 'Premature ejaculation',
      desc: 'Understanding arousal patterns, regulation and body signals.',
    },
    {
      num: '03',
      title: 'Reduced sensitivity or experience',
      desc: 'A slow return to embodied sensation and presence.',
    },
    {
      num: '04',
      title: 'Tension or pain during intimacy',
      desc: 'Attentive bodywork with pelvic tension and areas of discomfort.',
    },
    {
      num: '05',
      title: 'Consequences of surgeries or injuries, including scars',
      desc: 'Focused work on scar tissue, mobility and comfort.',
    },
    {
      num: '06',
      title: 'Disconnection from the body',
      desc: 'Rebuilding awareness of what you feel and how you respond.',
    },
    {
      num: '07',
      title: 'Excessive pornography consumption and its impact',
      desc: 'Understanding habits, expectations and embodied intimacy.',
    },
    {
      num: '08',
      title: 'Understanding the female body and intimacy',
      desc: 'A grounded, respectful space to learn and ask openly.',
    },
  ];

  const sessions = [
    {
      num: '01',
      id: 'prostate-mapping-2h',
      title: 'Prostate Mapping',
      desc: 'A gentle and conscious practice focused on awareness, sensitivity, and release in the pelvic area.',
    },
    {
      num: '02',
      id: 'scars-pain-2h',
      title: 'Working with Scars and Pain',
      desc: 'Focused bodywork supporting awareness, comfort, and sensitivity around scar tissue and areas of tension.',
    },
    {
      num: '03',
      id: 'erection-ejaculation-2h',
      title: 'Working with Erection and Ejaculation',
      desc: 'Body-based work focused on understanding arousal, physical responses, and patterns around erection and ejaculation.',
    },
    {
      num: '04',
      id: 'pornography-use-2h',
      title: 'Working with Problematic Pornography Use',
      desc: 'Individual guidance for understanding pornography habits and developing a more conscious relationship with sexuality.',
    },
    {
      num: '05',
      id: 'face-massage-men-2h',
      title: 'Face Massage',
      desc: 'Manual work with the jaw, forehead and facial muscles — releasing tension and restoring natural mobility.',
      isFullWidth: true,
    },
  ];

  const safetyPoints = [
    { num: '01', text: 'Every session begins with a conversation.' },
    { num: '02', text: 'Boundaries are defined together, before any bodywork begins.' },
    { num: '03', text: 'All bodywork is consent-led — you can pause, adjust or stop at any moment.' },
    { num: '04', text: 'Intimate bodywork is professional bodywork and is not an erotic service.' },
    { num: '05', text: 'Where intimate bodywork is involved, hygiene and professional standards are followed.' },
  ];

  return (
    <div id="for-men-view" className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="pt-8 sm:pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-accent-editorial block">
                For Men
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-main leading-[1.05]">
                Awareness<br />
                <em className="italic text-accent-editorial">before</em> performance.
              </h1>
              <p className="text-sm sm:text-base text-muted-editorial font-light leading-relaxed max-w-xl">
                Individual bodywork and guidance for men who want to better understand their bodies, sensitivity,
                intimacy and physical responses. A space to explore specific challenges, or simply develop greater
                body awareness, confidence and connection.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onOpenBooking('prostate-mapping-2h')}
                  className="px-6 py-3 rounded-xs text-[11px] uppercase tracking-[0.13em] font-semibold bg-[#32231F] text-[#FCFAF7] hover:bg-accent-editorial hover:text-white transition-colors cursor-pointer"
                >
                  Book a Session
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 rounded-xs overflow-hidden border border-line bg-alt shadow-xs">
                <img
                  id="men-hero-image"
                  src="https://raw.githubusercontent.com/alansmorais/she/main/images/for-men-ClXMk--b.jpg"
                  alt="Man's back and shoulders in natural warm light"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. AREAS OF SUPPORT */}
      <section className="border-t border-line pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-accent-editorial block">
                Areas of Support
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-main leading-[1.05]">
                Different bodies,<br />
                <em className="italic text-accent-editorial">different needs.</em>
              </h2>
              <p className="text-sm text-muted-editorial font-light leading-relaxed">
                You do not need to identify with a specific problem before booking. The work can also support
                curiosity, greater awareness and a deeper understanding of your own body.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
              {supportItems.map((item) => (
                <div key={item.num} className="border-t border-line pt-4 space-y-2">
                  <div className="flex items-baseline space-x-2.5">
                    <span className="text-[11px] font-semibold tracking-[0.15em] text-accent-editorial font-sans">
                      {item.num}
                    </span>
                    <h4 className="font-serif text-xl sm:text-2xl text-main font-normal leading-snug">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-editorial font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. STATEMENT BANNER */}
      <section className="border-t border-line py-16 text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-main leading-relaxed">
            The work is not about achieving a specific sexual outcome. It is about understanding{' '}
            <em className="italic text-accent-editorial">
              body signals, tension, sensitivity, arousal patterns and boundaries
            </em>{' '}
            — and your own individual experience.
          </h2>
        </div>
      </section>

      {/* 4. SESSIONS FOR MEN */}
      <section className="border-t border-line pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-5 space-y-2">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-accent-editorial block">
                Sessions
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-main leading-[1.05]">
                Sessions <em className="italic text-accent-editorial">for men.</em>
              </h2>
            </div>
            <p className="lg:col-span-7 text-xs sm:text-sm text-muted-editorial font-light leading-relaxed">
              Four kinds of sessions, each addressing a different territory of the male body. Each session is shaped
              around your experience and pace. Not every practitioner offers every service — we will help match you when
              you get in touch.
            </p>
          </div>

          {/* Full-width session banner */}
          <div className="w-full h-64 sm:h-96 lg:h-[450px] rounded-xs overflow-hidden border border-line bg-alt shadow-xs">
            <img
              src="https://raw.githubusercontent.com/alansmorais/she/main/images/for-men-massage.jpg"
              alt="Hands massaging male chest and shoulders in gentle light"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Sessions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-line">
            {sessions.map((sess) => (
              <div
                key={sess.num}
                className={`p-6 sm:p-8 border-r border-b border-line flex flex-col justify-between min-h-[220px] ${
                  sess.isFullWidth ? 'md:col-span-2' : ''
                }`}
              >
                <div className="space-y-3 mb-6">
                  <span className="text-[11px] font-semibold tracking-[0.15em] text-accent-editorial block">
                    {sess.num}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-main font-normal leading-snug">
                    {sess.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-editorial font-light leading-relaxed max-w-xl">
                    {sess.desc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenBooking(sess.id)}
                  className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-[0.15em] font-semibold text-main hover:text-accent-editorial border-b border-main hover:border-accent-editorial pb-1 self-start transition-colors cursor-pointer"
                >
                  <span>Explore the session</span>
                  <span>&rarr;</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SAFETY & CONSENT */}
      <section className="border-t border-line py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-accent-editorial block">
                Safety &amp; Consent
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-main leading-[1.05]">
                Professional bodywork,<br />
                <em className="italic text-accent-editorial">held with care.</em>
              </h2>
              <p className="text-sm text-muted-editorial font-light leading-relaxed">
                Every session is grounded in clarity, consent and professional practice. The work is body-based and
                non-judgmental — never an erotic service.
              </p>
            </div>

            <div className="lg:col-span-7 border-t border-line divide-y divide-line">
              {safetyPoints.map((pt) => (
                <div key={pt.num} className="grid grid-cols-[36px_1fr] gap-4 py-4 items-baseline">
                  <span className="text-[11px] font-semibold tracking-[0.15em] text-accent-editorial">
                    {pt.num}
                  </span>
                  <span className="text-xs sm:text-sm text-main font-light leading-snug">
                    {pt.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHERE TO BEGIN */}
      <section className="border-t border-line py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 aspect-4/5 rounded-xs overflow-hidden border border-line bg-alt shadow-xs">
              <img
                src="https://raw.githubusercontent.com/alansmorais/she/main/images/for-men-seated-B6xzYU6M.jpg"
                alt="Man sitting pensively in sunlight"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-accent-editorial block">
                Where to begin
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-main leading-[1.05]">
                Not sure where to <em className="italic text-accent-editorial">begin?</em>
              </h2>
              <p className="text-sm sm:text-base text-muted-editorial font-light leading-relaxed max-w-xl">
                You do not need to know exactly which service is right for you before getting in touch. Tell us what you
                are experiencing, what you would like to understand, or what kind of support you are looking for — and we
                can help guide you toward a suitable practitioner and session.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => onOpenBooking('prostate-mapping-2h')}
                  className="px-6 py-3 rounded-xs text-[11px] uppercase tracking-[0.13em] font-semibold bg-[#32231F] text-[#FCFAF7] hover:bg-accent-editorial hover:text-white transition-colors cursor-pointer"
                >
                  Book a Session
                </button>
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="inline-flex items-center text-[10px] uppercase tracking-[0.15em] font-semibold text-main hover:text-accent-editorial border-b border-main hover:border-accent-editorial pb-1 transition-colors cursor-pointer"
                >
                  Contact Us &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
