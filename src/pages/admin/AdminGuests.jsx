import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function AdminGuests() {
  const { data: bookings = [] } = useQuery({
    queryKey: ["admin-guest-list"],
    queryFn: () => base44.entities.Booking.list("-created_date", 500),
  });

  const guestMap = {};
  bookings.forEach((b) => {
    if (!guestMap[b.guest_email]) {
      guestMap[b.guest_email] = { name: b.guest_name, email: b.guest_email, phone: b.guest_phone, bookings: [] };
    }
    guestMap[b.guest_email].bookings.push(b);
  });
  const guests = Object.values(guestMap).sort((a, b) => b.bookings.length - a.bookings.length);

  return (
    <div>
      <h1 className="font-heading text-3xl font-light text-bone mb-8">Guests</h1>

      <div className="bg-white border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bone">
              <th className="text-left p-4 label-caps text-stone text-xs font-normal">Name</th>
              <th className="text-left p-4 label-caps text-stone text-xs font-normal">Email</th>
              <th className="text-left p-4 label-caps text-stone text-xs font-normal">Phone</th>
              <th className="text-left p-4 label-caps text-stone text-xs font-normal">Bookings</th>
              <th className="text-left p-4 label-caps text-stone text-xs font-normal">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((g) => (
              <tr key={g.email} className="border-b border-border last:border-0">
                <td className="p-4 text-charcoal">{g.name}</td>
                <td className="p-4 text-stone">{g.email}</td>
                <td className="p-4 text-stone">{g.phone || "—"}</td>
                <td className="p-4 text-charcoal">{g.bookings.length}</td>
                <td className="p-4 text-charcoal">€{g.bookings.reduce((s, b) => s + (b.total_price || 0), 0).toLocaleString()}</td>
              </tr>
            ))}
            {guests.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-stone">No guests yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}