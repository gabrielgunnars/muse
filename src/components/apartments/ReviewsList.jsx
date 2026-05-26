import React from "react";
import { Star } from "lucide-react";
import FadeInSection from "../shared/FadeInSection";

export default function ReviewsList({ reviews = [] }) {
  const approvedReviews = reviews.filter((r) => r.approved);
  if (approvedReviews.length === 0) return null;

  const avgRating = (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1);

  return (
    <div className="mt-16">
      <div className="flex items-center gap-3 mb-8">
        <Star size={20} className="text-clay fill-clay" />
        <span className="font-heading text-2xl text-charcoal">{avgRating}</span>
        <span className="text-stone">· {approvedReviews.length} review{approvedReviews.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {approvedReviews.map((review, i) => (
          <FadeInSection key={review.id} delay={i * 0.1}>
            <div className="border-t border-border pt-6">
              <div className="flex items-center gap-2 mb-2">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={12} className={j < review.rating ? "text-clay fill-clay" : "text-border"} />
                ))}
              </div>
              <p className="text-sm text-charcoal leading-relaxed mb-3">{review.body}</p>
              <p className="label-caps text-stone">{review.guest_name}</p>
            </div>
          </FadeInSection>
        ))}
      </div>
    </div>
  );
}