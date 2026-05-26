import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowLeft, Wifi, Coffee, Car, Waves, Wind, BookOpen, Monitor, Droplets } from "lucide-react";
import ImageGallery from "../components/apartments/ImageGallery";
import BookingWidget from "../components/apartments/BookingWidget";
import ReviewsList from "../components/apartments/ReviewsList";
import FadeInSection from "../components/shared/FadeInSection";
import SectionLabel from "../components/shared/SectionLabel";
import { Skeleton } from "@/components/ui/skeleton";

const amenityIcons = {
  WiFi: Wifi,
  Kitchen: Coffee,
  Parking: Car,
  "Harbour View": Waves,
  "Lake View": Waves,
  "City View": Wind,
  Library: BookOpen,
  Workspace: Monitor,
  "Underfloor Heating": Droplets,
};

export default function ApartmentDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = window.location.pathname.split("/apartments/")[1];

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["property", slug],
    queryFn: () => base44.entities.Property.filter({ slug, is_active: true }),
  });

  const property = properties[0];

  const { data: bookings = [] } = useQuery({
    queryKey: ["bookings", property?.id],
    queryFn: () => base44.entities.Booking.filter({ property_id: property.id }),
    enabled: !!property?.id,
  });

  const { data: blockedDates = [] } = useQuery({
    queryKey: ["blocked", property?.id],
    queryFn: () => base44.entities.BlockedDate.filter({ property_id: property.id }),
    enabled: !!property?.id,
  });

  const { data: seasonalPrices = [] } = useQuery({
    queryKey: ["seasonal", property?.id],
    queryFn: () => base44.entities.SeasonalPrice.filter({ property_id: property.id }),
    enabled: !!property?.id,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", property?.id],
    queryFn: () => base44.entities.Review.filter({ property_id: property.id }),
    enabled: !!property?.id,
  });

  if (isLoading) {
    return (
      <div className="pt-20 max-w-7xl mx-auto px-6 py-16">
        <Skeleton className="h-[60vh] w-full mb-8" />
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center">
        <p className="font-heading text-3xl text-charcoal mb-4">Apartment not found</p>
        <Link to="/apartments" className="label-caps text-clay hover:text-charcoal transition-colors">
          Back to apartments
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
        <Link to="/apartments" className="inline-flex items-center gap-2 label-caps text-stone hover:text-charcoal transition-colors mb-8">
          <ArrowLeft size={14} /> Back
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <ImageGallery images={property.images} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          <div className="lg:col-span-2">
            <FadeInSection>
              <SectionLabel>
                {property.bedrooms} {property.bedrooms === 1 ? "Bedroom" : "Bedrooms"} · Up to {property.max_guests} Guests
              </SectionLabel>
              <h1 className="font-heading text-5xl lg:text-6xl font-light text-charcoal mb-6">
                {property.name}
              </h1>
              <p className="text-stone leading-relaxed max-w-2xl text-lg">
                {property.description}
              </p>
            </FadeInSection>

            <FadeInSection delay={0.2} className="mt-12">
              <h2 className="label-caps text-charcoal mb-6">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(property.amenities || []).map((amenity) => {
                  const Icon = amenityIcons[amenity];
                  return (
                    <div key={amenity} className="flex items-center gap-3 py-3 border-b border-border">
                      {Icon && <Icon size={18} className="text-clay" strokeWidth={1.5} />}
                      <span className="text-sm text-charcoal">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </FadeInSection>

            <FadeInSection delay={0.3}>
              <ReviewsList reviews={reviews} />
            </FadeInSection>
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-28">
              <BookingWidget
                property={property}
                bookings={bookings}
                blockedDates={blockedDates}
                seasonalPrices={seasonalPrices}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}