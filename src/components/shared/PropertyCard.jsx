import React from "react";
import { Link } from "react-router-dom";
import { Users, BedDouble, ArrowRight } from "lucide-react";
import FadeInSection from "./FadeInSection";

export default function PropertyCard({ property, delay = 0 }) {
  return (
    <FadeInSection delay={delay}>
      <Link
        to={`/apartments/${property.slug}`}
        className="group block"
      >
        <div className="relative overflow-hidden mb-5 aspect-[4/5]">
          <img
            src={property.images?.[0] || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"}
            alt={property.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="space-y-2 group-hover:bg-bone/3 p-2 -mx-2 transition-colors">
          <p className="label-caps text-stone">
            {property.bedrooms} {property.bedrooms === 1 ? "Bedroom" : "Bedrooms"} · Up to {property.max_guests} Guests
          </p>
          <h3 className="font-heading text-2xl lg:text-3xl font-light text-charcoal">
            {property.name}
          </h3>
          <p className="text-sm text-stone leading-relaxed line-clamp-2">
            {property.short_description}
          </p>
          <div className="flex items-center justify-between pt-2">
            <p className="font-heading text-lg text-charcoal">
              €{property.base_nightly_rate} <span className="text-sm text-stone font-body">/ night</span>
            </p>
            <span className="label-caps text-clay flex items-center gap-1 group-hover:gap-2 transition-all">
              View <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </Link>
    </FadeInSection>
  );
}