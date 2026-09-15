import React from 'react';
import { Workshop } from '../types';
import { Calendar, ArrowRight, Sparkles, Clock, MapPin, Compass, Users, CheckCircle2 } from 'lucide-react';

interface WorkshopsViewProps {
  workshops?: Workshop[];
  onOpenBooking: (serviceId?: string, practitionerId?: string) => void;
  onOpenContact?: (prefilledMessage?: string) => void;
}

export const WorkshopsView: React.FC<WorkshopsViewProps> = ({
  workshops = [],
  onOpenBooking,
  onOpenContact,
}) => {
  const hasWorkshops = workshops && workshops.length > 0;

  return (
    <div id="workshops-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-14">
      {/* Header Banner */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-line text-xs uppercase tracking-widest text-accent-editorial bg-alt/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Group Immersions &bull; Copenhagen</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-main leading-tight">
          Workshops &amp; Group Immersions
        </h1>
        <p className="text-base sm:text-lg text-muted-editorial font-light leading-relaxed">
          While individual sessions offer private somatic care, our group workshops provide the unique medicine of
          communal witness, shared vulnerability, and grounded experiential learning. Held in small cohorts with
          generous facilitator ratios.
        </p>
      </div>

      {/* Active Workshops or Coming Soon State */}
      {hasWorkshops ? (
        <div className="space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {workshops.map((w) => {
              const spotsText =
                w.spotsLeft <= 3
                  ? `Only ${w.spotsLeft} spot${w.spotsLeft === 1 ? '' : 's'} remaining`
                  : `${w.spotsLeft} of ${w.capacity} spots open`;

              return (
                <div
                  key={w.id}
                  className="rounded-3xl border border-line bg-card overflow-hidden shadow-xs flex flex-col justify-between transition-all hover:shadow-md hover:border-accent-editorial/40"
                >
                  <div>
                    {/* Workshop Cover Image */}
                    <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-alt">
                      <img
                        src={w.image || 'https://raw.githubusercontent.com/alansmorais/she/main/images/for-women-seated.jpg'}
                        alt={w.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-main/90 backdrop-blur-xs text-main px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-line">
                        {spotsText}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8 space-y-6">
                      <div className="space-y-2">
                        {w.subtitle && (
                          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-accent-editorial block">
                            {w.subtitle}
                          </span>
                        )}
                        <h2 className="font-serif text-2xl sm:text-3xl text-main font-normal leading-snug">
                          {w.title}
                        </h2>
                      </div>

                      {/* Metadata badges */}
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-editorial pt-1 border-y border-line py-3">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-accent-editorial shrink-0" />
                          <span className="font-medium text-main">{w.date}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-accent-editorial shrink-0" />
                          <span>{w.time}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="w-3.5 h-3.5 text-accent-editorial shrink-0" />
                          <span>{w.location}</span>
                        </div>
                        {w.facilitators && w.facilitators.length > 0 && (
                          <div className="flex items-center space-x-1.5">
                            <Users className="w-3.5 h-3.5 text-accent-editorial shrink-0" />
                            <span>Faculty: {w.facilitators.join(', ')}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-muted-editorial font-light leading-relaxed whitespace-pre-line">
                        {w.description}
                      </p>

                      {w.curriculum && w.curriculum.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-main">
                            Immersion Highlights
                          </h4>
                          <ul className="space-y-1.5 text-xs text-muted-editorial">
                            {w.curriculum.map((item, idx) => (
                              <li key={idx} className="flex items-start space-x-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-accent-editorial shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="p-6 sm:p-8 pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-line/60 mt-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-muted-editorial block font-medium">
                        Investment
                      </span>
                      <div className="font-serif text-2xl sm:text-3xl text-main font-medium">
                        {w.price.toLocaleString()} {w.currency || 'kr'}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenContact) {
                            onOpenContact(
                              `Hi SHE. Academy,\n\nI would like to reserve a spot for the workshop "${w.title}" taking place on ${w.date} at ${w.location}.\n\nPlease let me know the next steps for confirmation.\n\nThank you!`
                            );
                          } else {
                            onOpenBooking();
                          }
                        }}
                        className="flex-1 sm:flex-none px-6 py-3 rounded-full text-xs uppercase tracking-widest font-semibold bg-[#32231F] text-[#FCFAF7] hover:bg-accent-editorial hover:text-white transition-all shadow-xs cursor-pointer flex items-center justify-center space-x-2"
                      >
                        <span>Reserve Spot</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Waiting List Card */}
          <div className="p-8 sm:p-10 rounded-2xl border border-line bg-alt/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="font-serif text-2xl text-main font-normal">
                Looking for different dates or a custom cohort?
              </h3>
              <p className="text-xs sm:text-sm text-muted-editorial font-light max-w-xl">
                We also host private immersions for small groups, partner circles, and seasonal embodiment journeys.
                Join our notification circle to receive announcements for future retreats.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onOpenContact) {
                  onOpenContact(
                    `Hi SHE. Academy,\n\nI would like to be notified about future workshop dates and cohort openings.\n\nThank you!`
                  );
                }
              }}
              className="px-6 py-3 rounded-full text-xs uppercase tracking-widest font-semibold border border-line bg-card text-main hover:border-main transition-all shrink-0 cursor-pointer"
            >
              Join Notification Circle
            </button>
          </div>
        </div>
      ) : (
        /* Pristine Coming Soon Container (When no workshops are scheduled) */
        <div className="rounded-3xl border border-line bg-card overflow-hidden shadow-xs p-8 sm:p-12 lg:p-16 flex flex-col items-center text-center max-w-4xl mx-auto space-y-8 relative">
          <div className="w-16 h-16 rounded-full bg-alt/30 flex items-center justify-center text-accent-editorial">
            <Compass className="w-8 h-8" />
          </div>

          <div className="space-y-4 max-w-2xl">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-accent-editorial block">
              Curation In Progress
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-main font-normal">
              New Immersions Coming Soon
            </h2>
            <p className="text-sm sm:text-base text-muted-editorial leading-relaxed font-light">
              Our upcoming workshop calendar, seasonal weekend retreats, and group embodiment circles are currently being curated by the SHE. Academy faculty. 
            </p>
            <p className="text-xs sm:text-sm text-accent-editorial font-light italic">
              There are no active public workshops scheduled at this exact moment.
            </p>
          </div>

          <div className="w-full max-w-md p-6 bg-[#FCFAF7] rounded-2xl border border-line/60 space-y-4">
            <h3 className="font-serif text-lg text-main">Get Priority Notification</h3>
            <p className="text-xs text-muted-editorial font-light">
              Join our priority workshop waiting list to receive early registration access and exclusive calendar announcements before they are opened to the public.
            </p>
            <button
              type="button"
              onClick={() => {
                if (onOpenContact) {
                  onOpenContact(
                    `Hi SHE. Academy,\n\nI would like to join the priority waiting list for your upcoming workshops and group immersions. Please notify me as soon as the workshop calendar is announced!\n\nThank you!`
                  );
                }
              }}
              className="w-full justify-center px-6 py-3 rounded-full text-xs uppercase tracking-widest font-semibold bg-[#32231F] text-[#FCFAF7] hover:bg-accent-editorial hover:text-white transition-all shadow-xs cursor-pointer flex items-center space-x-2"
            >
              <span>Join Priority Waiting List</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
