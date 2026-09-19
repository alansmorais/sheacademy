import React, { useState } from 'react';
import { ReviewItem, FeedbackItem } from '../types';
import { storageService } from '../services/storageService';
import { X, Star, MessageSquareHeart, CheckCircle2, Send } from 'lucide-react';

interface FeedbackDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reviews: ReviewItem[];
}

export const FeedbackDrawer: React.FC<FeedbackDrawerProps> = ({
  isOpen,
  onClose,
  reviews,
}) => {
  const [activeTab, setActiveTab] = useState<'reviews' | 'submit'>('reviews');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState('Session Reflection');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    storageService.addFeedback({
      name: name.trim(),
      email: email.trim(),
      rating,
      category,
      message: message.trim(),
    });

    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSubmitted(false);
      setActiveTab('reviews');
    }, 2500);
  };

  return (
    <div
      id="feedback-drawer-overlay"
      className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end"
    >
      <div
        id="feedback-drawer-panel"
        className="w-full max-w-md bg-card border-l border-line h-full flex flex-col shadow-2xl transition-all"
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-line bg-alt/60 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquareHeart className="w-4 h-4 text-accent-editorial" />
            <h3 className="font-serif text-xl text-main font-normal">Client Reflections</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-muted-editorial hover:text-main hover:bg-main cursor-pointer"
            aria-label="Close reflections drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-line text-xs uppercase tracking-widest font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-b-2 border-accent-editorial text-accent-editorial font-semibold bg-main/50'
                : 'text-muted-editorial hover:text-main'
            }`}
          >
            Reflections ({reviews.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('submit')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              activeTab === 'submit'
                ? 'border-b-2 border-accent-editorial text-accent-editorial font-semibold bg-main/50'
                : 'text-muted-editorial hover:text-main'
            }`}
          >
            Share Your Experience
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'reviews' ? (
            <div className="space-y-6">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-xl border border-line bg-main/50 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-main text-sm">{r.author}</span>
                    <div className="flex text-amber-500">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                  <div className="text-muted-editorial text-[11px]">
                    Session: <span className="text-main">{r.serviceName}</span> with{' '}
                    <span className="text-accent-editorial">{r.practitionerName}</span>
                  </div>
                  <p className="text-muted-editorial leading-relaxed italic pt-1">
                    "{r.text}"
                  </p>
                  <div className="text-[10px] text-muted-editorial/60 text-right pt-1">
                    {r.date}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {submitted ? (
                <div className="text-center py-12 space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-accent-editorial mx-auto" />
                  <h4 className="font-serif text-xl text-main font-normal">Thank You</h4>
                  <p className="text-xs text-muted-editorial max-w-xs mx-auto">
                    Your reflection has been submitted to the SHE. Academy practitioners.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-muted-editorial font-medium mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Elena R."
                      className="w-full px-3 py-2 rounded-lg border border-line bg-main text-main text-xs focus:outline-none focus:border-accent-editorial"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-muted-editorial font-medium mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="elena@example.com"
                      className="w-full px-3 py-2 rounded-lg border border-line bg-main text-main text-xs focus:outline-none focus:border-accent-editorial"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-muted-editorial font-medium mb-1">
                      Rating
                    </label>
                    <div className="flex items-center space-x-1 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= rating
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-line'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-muted-editorial font-medium mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-line bg-main text-main text-xs focus:outline-none focus:border-accent-editorial"
                    >
                      <option value="Session Reflection">Session Reflection</option>
                      <option value="Practitioner Appreciation">Practitioner Appreciation</option>
                      <option value="Studio Environment">Studio Environment</option>
                      <option value="General Feedback">General Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-muted-editorial font-medium mb-1">
                      Reflection & Experience *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe how your body, nervous system, or relational insights felt after the session..."
                      className="w-full px-3 py-2 rounded-lg border border-line bg-main text-main text-xs focus:outline-none focus:border-accent-editorial"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-full text-xs uppercase tracking-widest bg-accent-editorial text-white font-medium hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Reflection</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
