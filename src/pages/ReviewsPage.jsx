import { useState } from 'react';
import { Star, Camera, Send } from 'lucide-react';

export default function ReviewsPage() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!rating) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-24">
      <div className="p-4 max-w-lg mx-auto space-y-6">
        <h1 className="text-lg font-bold">Write a Review</h1>

        {submitted ? (
          <div className="flex flex-col items-center py-16 animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mb-4">
              <Star size={32} className="text-warning fill-warning" />
            </div>
            <h2 className="text-xl font-bold">Thank You!</h2>
            <p className="text-text-secondary text-sm mt-1">Your review has been submitted</p>
          </div>
        ) : (
          <>
            <div className="bg-bg-card rounded-2xl p-5 border border-border text-center">
              <p className="text-sm text-text-secondary mb-4">How was your experience?</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={() => setRating(star)} className="active:scale-125 transition-transform">
                    <Star size={36} className={`transition-colors ${star <= rating ? 'text-warning fill-warning' : 'text-text-muted'}`} />
                  </button>
                ))}
              </div>
              <p className="text-xs text-text-muted mt-3">{['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}</p>
            </div>

            <div className="bg-bg-card rounded-2xl p-4 border border-border">
              <h3 className="text-sm font-semibold mb-2">Your Review</h3>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about your experience..."
                className="w-full bg-bg-primary border border-border rounded-xl p-3 text-sm focus:border-accent-orange focus:outline-none transition-colors placeholder:text-text-muted resize-none h-28" />
            </div>

            <div className="bg-bg-card rounded-2xl p-4 border border-border">
              <h3 className="text-sm font-semibold mb-3">Add Photos</h3>
              <div className="flex gap-3">
                <button className="w-20 h-20 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-text-muted active:scale-95 transition-transform">
                  <Camera size={20} />
                  <span className="text-[10px]">Add Photo</span>
                </button>
              </div>
            </div>

            <button onClick={handleSubmit} disabled={!rating} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-40">
              <Send size={16} /> Submit Review
            </button>
          </>
        )}
      </div>
    </div>
  );
}
