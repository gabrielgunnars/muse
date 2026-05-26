import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import PropertyCard from "../components/shared/PropertyCard";
import FadeInSection from "../components/shared/FadeInSection";
import SectionLabel from "../components/shared/SectionLabel";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Apartments() {
  const [guestFilter, setGuestFilter] = useState("all");

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: () => base44.entities.Property.filter({ is_active: true }),
  });

  const filtered = guestFilter === "all"
    ? properties
    : properties.filter((p) => p.max_guests >= parseInt(guestFilter));

  return (
    <div className="pt-20">
      <section className="py-20 lg:py-28 bg-bone">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <FadeInSection>
            <SectionLabel>Stay</SectionLabel>
            <h1 className="font-heading text-5xl lg:text-7xl font-light text-charcoal mb-4">
              Our Apartments
            </h1>
            <p className="text-stone max-w-xl leading-relaxed">
              Each MUSE apartment is a considered space — designed for living, not just staying.
              Every detail reflects our love for Reykjavík.
            </p>
          </FadeInSection>

          <FadeInSection delay={0.2} className="mt-10 flex gap-4 items-center">
            <span className="label-caps text-stone">Guests</span>
            <Select value={guestFilter} onValueChange={setGuestFilter}>
              <SelectTrigger className="w-40 bg-cream border-stone/30 text-charcoal">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-cream text-charcoal">
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
                <SelectItem value="6">6+</SelectItem>
              </SelectContent>
            </Select>
          </FadeInSection>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/5] w-full" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-48" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-stone py-20">No apartments match your criteria.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {filtered.map((property, i) => (
                <PropertyCard key={property.id} property={property} delay={i * 0.1} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}