import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, DollarSign, Star, Building2 } from "lucide-react";
import { isPast, parseISO, isFuture, isThisMonth } from "date-fns";

export default function Dashboard() {
  const { data: bookings = [] } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => base44.entities.Booking.list("-created_date", 500),
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: () => base44.entities.Review.list(),
  });

  const { data: properties = [] } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: () => base44.entities.Property.list(),
  });

  const upcoming = bookings.filter(
    (b) => b.status !== "cancelled" && isFuture(parseISO(b.check_in))
  );
  const monthRevenue = bookings
    .filter((b) => b.status !== "cancelled" && isThisMonth(parseISO(b.created_date)))
    .reduce((s, b) => s + (b.total_price || 0), 0);
  const pendingReviews = reviews.filter((r) => !r.approved);

  const stats = [
    { label: "Upcoming Bookings", value: upcoming.length, icon: CalendarDays },
    { label: "Revenue This Month", value: `€${monthRevenue.toLocaleString()}`, icon: DollarSign },
    { label: "Reviews Pending", value: pendingReviews.length, icon: Star },
    { label: "Active Properties", value: properties.filter((p) => p.is_active).length, icon: Building2 },
  ];

  return (
    <div>
      <h1 className="font-heading text-3xl font-light text-bone mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-border p-6">
            <div className="flex items-center gap-3 mb-3">
              <stat.icon size={18} className="text-clay" />
              <p className="label-caps text-stone text-xs">{stat.label}</p>
            </div>
            <p className="font-heading text-3xl text-charcoal">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-border p-6">
        <h2 className="label-caps text-charcoal mb-4">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-warm-dark">
                <th className="text-left py-3 label-caps text-white text-xs font-normal">Guest</th>
                <th className="text-left py-3 label-caps text-white text-xs font-normal">Property</th>
                <th className="text-left py-3 label-caps text-white text-xs font-normal">Dates</th>
                <th className="text-left py-3 label-caps text-white text-xs font-normal">Total</th>
                <th className="text-left py-3 label-caps text-white text-xs font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 10).map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0">
                  <td className="py-3 text-charcoal">{b.guest_name}</td>
                  <td className="py-3 text-stone">{b.property_name}</td>
                  <td className="py-3 text-stone">{b.check_in} → {b.check_out}</td>
                  <td className="py-3 text-charcoal">€{b.total_price}</td>
                  <td className="py-3">
                    <span className={`label-caps text-xs px-2 py-1 ${
                      b.status === "confirmed" ? "bg-green-50 text-green-700" :
                      b.status === "cancelled" ? "bg-red-50 text-red-700" :
                      "bg-yellow-50 text-yellow-700"
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-stone">No bookings yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}