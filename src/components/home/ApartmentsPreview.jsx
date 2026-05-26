import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import PropertyCard from "../shared/PropertyCard";
import FadeInSection from "../shared/FadeInSection";
import SectionLabel from "../shared/SectionLabel";
import { Skeleton } from "@/components/ui/skeleton";

export default function ApartmentsPreview() {
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["properties-preview"],
    queryFn: () => base44.entities.Property.filter({ is_active: true }, "-created_date", 3),
  });

  return (
    <section className="py-24 lg:py-32 bg-bone">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <FadeInSection className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div>
            <SectionLabel>Stay</SectionLabel>
            <h2 className="font-heading text-4xl lg:text-5xl font-light text-charcoal">
              Our Apartments
            </h2>
          </div>
          <Link
            to="/apartments"
            className="label-caps text-charcoal mt-4 md:mt-0 flex items-center gap-2 hover:gap-3 transition-all hover:text-clay"
          >
            View All <ArrowRight size={14} />
          </Link>
        </FadeInSection>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/5] w-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {properties.map((property, i) => (
              <PropertyCard key={property.id} property={property} delay={i * 0.15} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}