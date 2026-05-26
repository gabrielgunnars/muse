import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Coffee, UtensilsCrossed, Wine, BookOpen, Palette, Trees, ArrowRight } from "lucide-react";
import FadeInSection from "../components/shared/FadeInSection";
import SectionLabel from "../components/shared/SectionLabel";
import { Skeleton } from "@/components/ui/skeleton";

const categoryMeta = {
  coffee: { label: "Coffee", icon: Coffee, description: "Where the locals go for their morning ritual" },
  restaurant: { label: "Restaurants", icon: UtensilsCrossed, description: "From sea-to-table to quiet neighbourhood gems" },
  bar: { label: "Bars", icon: Wine, description: "Evening spots with character" },
  bookshop: { label: "Bookshops", icon: BookOpen, description: "Reykjavík is a city of readers" },
  gallery: { label: "Galleries", icon: Palette, description: "Contemporary art in unexpected spaces" },
  nature: { label: "Nature", icon: Trees, description: "Step outside and the wild begins" },
};

export default function CityGuide() {
  const { data: venues = [], isLoading } = useQuery({
    queryKey: ["city-guide-venues"],
    queryFn: () => base44.entities.ConciergeVenue.filter({ is_active: true }),
  });

  const grouped = {};
  venues.forEach((v) => {
    if (!grouped[v.category]) grouped[v.category] = [];
    grouped[v.category].push(v);
  });

  return (
    <div className="pt-20">
      <section className="py-20 lg:py-28 bg-bone">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <FadeInSection>
            <SectionLabel>Explore</SectionLabel>
            <h1 className="font-heading text-5xl lg:text-7xl font-light text-charcoal mb-4">
              City Guide
            </h1>
            <p className="text-stone max-w-xl leading-relaxed text-lg">
              A curated collection of places we love in Reykjavík.
              Not a list — a point of view.
            </p>
          </FadeInSection>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-cream">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          {isLoading ? (
            <div className="space-y-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-8 w-40" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-20">
              {Object.entries(categoryMeta).map(([cat, meta], catIdx) => {
                const catVenues = grouped[cat];
                if (!catVenues?.length) return null;
                const Icon = meta.icon;
                return (
                  <FadeInSection key={cat} delay={catIdx * 0.1}>
                    <div className="flex items-center gap-4 mb-2">
                      <Icon size={24} className="text-clay" strokeWidth={1.5} />
                      <h2 className="font-heading text-3xl lg:text-4xl font-light text-charcoal">
                        {meta.label}
                      </h2>
                    </div>
                    <p className="text-stone text-sm mb-8 ml-10">{meta.description}</p>
                    <div className="space-y-0 ml-10">
                      {catVenues.map((venue) => (
                        <div key={venue.id} className="py-5 border-b border-border flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium text-charcoal">{venue.name}</p>
                            <p className="text-sm text-stone mt-1">{venue.description}</p>
                            {venue.area && <p className="label-caps text-xs text-clay mt-2">{venue.area}</p>}
                          </div>
                          {venue.url && (
                            <a href={venue.url} target="_blank" rel="noopener noreferrer"
                              className="label-caps text-stone hover:text-charcoal transition-colors flex-shrink-0">
                              Visit <ArrowRight size={12} className="inline" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </FadeInSection>
                );
              })}
            </div>
          )}

          <FadeInSection delay={0.3} className="mt-20 text-center">
            <p className="text-stone mb-6">Want personalised recommendations?</p>
            <Link to="/concierge"
              className="label-caps px-8 py-3 border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-all inline-block">
              Ask Our Concierge
            </Link>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}