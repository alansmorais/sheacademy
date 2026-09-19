import React from 'react';
import { Workshop } from '../types';
import { Calendar, ArrowRight, Sparkles, Compass } from 'lucide-react';

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
    <div id="workshops-page" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-line text-xs uppercase tracking-widest text-accent-editorial bg-alt/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Workshops &amp; Immersions</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-main leading-tight">
          Upcoming Workshops
        </h1>
        <p className="text-base sm:text-lg text-muted-editorial font-light leading-relaxed">
          Upcoming scheduled dates. Select a workshop to inquire or reserve your place.
        </p>
      </div>

      {/* Active Workshops 1 by 1 */}
      {hasWorkshops ? (
        <div className="space-y-4">
          <div className="divide-y divide-line/60 rounded-3xl border border-line bg-card overflow-hidden shadow-xs">
            {workshops.map((w, index) => {
              const isSoldOut = w.status === 'sold_out';

              return (
                <div
                  key={w.id || `ws-${index}`}
                  id={w.id}
                  className="scroll-mt-28 p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5 transition-colors hover:bg-alt/30 group"
                >
                  {/* Left: Date + Title */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 min-w-0">
                    <div className="flex items-center space-x-3 shrink-0">
                      <span className="px-3 py-1 rounded-lg bg-alt font-mono text-xs font-semibold text-accent-editorial border border-line whitespace-nowrap">
                        {w.date}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wider uppercase border inline-flex items-center space-x-1.5 ${
                          isSoldOut
                            ? 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                            : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSoldOut ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                        />
                        <span>{isSoldOut ? 'Sold Out' : 'Open'}</span>
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h2 className="font-serif text-lg sm:text-xl lg:text-2xl text-main font-normal group-hover:text-accent-editorial transition-colors">
                        {w.title}
                      </h2>
                      {w.subtitle && (
                        <p className="text-xs text-muted-editorial font-light mt-0.5">{w.subtitle}</p>
                      )}
                      {w.description && (
                        <p className="text-xs sm:text-sm text-muted-editorial font-light mt-1.5 leading-relaxed">{w.description}</p>
                      )}
                      {w.location && (
                        <p className="text-xs text-muted-editorial font-light mt-1">{w.location}</p>
                      )}
                    </div>
                  </div>

                  {/* Right: Action */}
                  <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-line/40">
                    {w.price != null && (
                      <span className="font-serif text-lg text-main font-medium whitespace-nowrap mr-2">
                        {w.price.toLocaleString()} {w.currency || 'kr'}
                      </span>
                    )}

                    <button
                      type="button"
                      disabled={isSoldOut}
                      onClick={() => {
                        if (onOpenContact) {
                          onOpenContact(
                            `Hi SHE. Academy,\n\nI would like to reserve a place for the workshop "${w.title}" on ${w.date}.\n\nPlease let me know the details and registration steps.\n\nThank you!`
                          );
                        } else {
                          onOpenBooking();
                        }
                      }}
                      className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer ${
                        isSoldOut
                          ? 'bg-alt text-muted-editorial cursor-not-allowed border border-line'
                          : 'bg-[#32231F] text-[#FCFAF7] hover:bg-accent-editorial hover:text-white'
                      }`}
                    >
                      <span>{isSoldOut ? 'Sold Out' : 'Reserve Spot'}</span>
                      {!isSoldOut && <ArrowRight className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Direct Inquiry Contact Box */}
          <div className="p-6 sm:p-8 rounded-2xl border border-line bg-alt/30 flex flex-col sm:flex-row items-center justify-between gap-6 mt-8">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-serif text-xl text-main font-normal">
                Questions about dates or reservations?
              </h3>
              <p className="text-xs sm:text-sm text-muted-editorial font-light max-w-xl">
                Reach out to our team directly for private group cohorts or general workshop inquiries.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onOpenContact) {
                  onOpenContact(
                    `Hi SHE. Academy,\n\nI have a question regarding your upcoming workshops.\n\nThank you!`
                  );
                }
              }}
              className="px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold border border-line bg-card text-main hover:border-main transition-all shrink-0 cursor-pointer"
            >
              Contact Us
            </button>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-line bg-card overflow-hidden shadow-xs p-8 sm:p-12 lg:p-16 flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
          <div className="w-14 h-14 rounded-full bg-alt/50 flex items-center justify-center text-accent-editorial">
            <Compass className="w-7 h-7" />
          </div>
          <div className="space-y-2 max-w-xl">
            <h2 className="font-serif text-2xl sm:text-3xl text-main font-normal">
              No Workshops Currently Scheduled
            </h2>
            <p className="text-xs sm:text-sm text-muted-editorial leading-relaxed font-light">
              Check back soon for new dates and announcements.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (onOpenContact) {
                onOpenContact(
                  `Hi SHE. Academy,\n\nI would like to be notified when new workshop dates are announced.\n\nThank you!`
                );
              }
            }}
            className="px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold bg-[#32231F] text-[#FCFAF7] hover:bg-accent-editorial hover:text-white transition-all shadow-xs cursor-pointer flex items-center space-x-2"
          >
            <span>Notify Me</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
