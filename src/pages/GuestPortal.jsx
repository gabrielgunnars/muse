import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO, isPast } from "date-fns";
import { Calendar, Key, Wifi, BookOpen, Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FadeInSection from "../components/shared/FadeInSection";
import SectionLabel from "../components/shared/SectionLabel";
import { Skeleton } from "@/components/ui/skeleton";

export default function GuestPortal() {
  const [email, setEmail] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");

  const { data: bookings = [], isLoading, refetch } = useQuery({
    queryKey: ["guest-bookings", guestEmail],
    queryFn: () => base44.entities.Booking.filter({ guest_email: guestEmail }),
    enabled: authenticated && !!guestEmail,
  });

  const { data: properties = [] } = useQuery({
    queryKey: ["guest-properties"],
    queryFn: () => base44.entities.Property.list(),
    enabled: authenticated,
  });

  const handleLogin = (e) => {
    e.preventDefault();
    setGuestEmail(email);
    setAuthenticated(true);
  };

  const getProperty = (id) => properties.find((p) => p.id === id);

  if (!authenticated) {
    return (
      <div className="pt-20 min-h-screen bg-bone flex items-center justify-center px-6">
        <FadeInSection className="text-center max-w-sm w-full">
          <p className="font-heading text-5xl font-light text-charcoal tracking-brand mb-2">MUSE</p>
          <p className="label-caps text-clay mb-10">Guest Portal</p>
          <form onSubmit={handleLogin} className="bg-white p-8 text-left space-y-5">
            <p className="text-sm text-stone mb-2">Enter the email you used for your booking.</p>
            <Input
              required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="border-0 border-b border-border rounded-none bg-transparent focus-visible:ring-0 px-0"
            />
            <button type="submit" className="w-full label-caps py-3 bg-charcoal text-white hover:bg-ink transition-colors">
              View My Stay
            </button>
          </form>
        </FadeInSection>
      </div>
    );
  }

  const upcoming = bookings.filter((b) => !isPast(parseISO(b.check_out)) && b.status !== "cancelled");
  const past = bookings.filter((b) => isPast(parseISO(b.check_out)) || b.status === "cancelled");

  return (
    <div className="pt-20 min-h-screen bg-bone">
      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16">
        <FadeInSection>
          <SectionLabel>Welcome Back</SectionLabel>
          <h1 className="font-heading text-4xl lg:text-5xl font-light text-charcoal mb-2">My Stay</h1>
          <p className="text-stone text-sm mb-12">{guestEmail}</p>
        </FadeInSection>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2].map((i) => <Skeleton key={i} className="h-40 w-full" />)}
          </div>
        ) : bookings.length === 0 ? (
          <FadeInSection className="text-center py-20">
            <p className="text-stone mb-4">No bookings found for this email.</p>
            <Link to="/apartments" className="label-caps text-clay hover:text-charcoal">Browse Apartments</Link>
          </FadeInSection>
        ) : (
          <div className="space-y-16">
            {upcoming.length > 0 && (
              <div>
                <h2 className="label-caps text-charcoal mb-6">Upcoming</h2>
                <div className="space-y-6">
                  {upcoming.map((booking) => {
                    const prop = getProperty(booking.property_id);
                    return (
                      <FadeInSection key={booking.id}>
                        <div className="bg-white p-6 lg:p-8">
                          <div className="flex flex-col lg:flex-row gap-6">
                            {prop?.images?.[0] && (
                              <img src={prop.images[0]} alt="" className="w-full lg:w-48 h-32 object-cover" />
                            )}
                            <div className="flex-1">
                              <h3 className="font-heading text-2xl text-charcoal mb-1">
                                {booking.property_name || prop?.name}
                              </h3>
                              <p className="text-sm text-stone mb-4">
                                {format(parseISO(booking.check_in), "MMM d")} — {format(parseISO(booking.check_out), "MMM d, yyyy")} · {booking.guests} guest{booking.guests !== 1 ? "s" : ""}
                              </p>
                              
                              {prop && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Key size={16} className="text-clay" />
                                    <div>
                                      <p className="label-caps text-xs text-stone">Door Code</p>
                                      <p className="text-charcoal font-medium">{prop.door_code || "—"}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Wifi size={16} className="text-clay" />
                                    <div>
                                      <p className="label-caps text-xs text-stone">WiFi</p>
                                      <p className="text-charcoal text-xs">{prop.wifi_details || "—"}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <MapPin size={16} className="text-clay" />
                                    <div>
                                      <p className="label-caps text-xs text-stone">Address</p>
                                      <p className="text-charcoal text-xs">{prop.address || "—"}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </FadeInSection>
                    );
                  })}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <div>
                <h2 className="label-caps text-charcoal mb-6">Past Stays</h2>
                <div className="space-y-4">
                  {past.map((booking) => (
                    <FadeInSection key={booking.id}>
                      <div className="bg-white p-6 flex items-center justify-between">
                        <div>
                          <p className="font-heading text-lg text-charcoal">{booking.property_name}</p>
                          <p className="text-xs text-stone mt-1">
                            {format(parseISO(booking.check_in), "MMM d")} — {format(parseISO(booking.check_out), "MMM d, yyyy")}
                          </p>
                        </div>
                        <span className={`label-caps text-xs ${booking.status === "cancelled" ? "text-destructive" : "text-stone"}`}>
                          {booking.status}
                        </span>
                      </div>
                    </FadeInSection>
                  ))}
                </div>
              </div>
            )}

            <FadeInSection className="flex flex-wrap gap-4 pt-4">
              <Link to="/concierge" className="label-caps px-6 py-2.5 border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-all">
                Ask Concierge
              </Link>
              <Link to="/city-guide" className="label-caps px-6 py-2.5 border border-border text-stone hover:border-charcoal hover:text-charcoal transition-all">
                City Guide
              </Link>
            </FadeInSection>
          </div>
        )}
      </div>
    </div>
  );
}