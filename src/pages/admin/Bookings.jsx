import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Loader2 } from "lucide-react";

export default function Bookings() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin-all-bookings"],
    queryFn: () => base44.entities.Booking.list("-created_date", 200),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Booking.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-bookings"] });
      setSelected(null);
    },
  });

  const filtered = statusFilter === "all" ? bookings : bookings.filter((b) => b.status === statusFilter);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-light text-bone">Bookings</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-warm-dark">
              <th className="text-left p-4 label-caps text-white text-xs font-normal">Guest</th>
              <th className="text-left p-4 label-caps text-white text-xs font-normal">Property</th>
              <th className="text-left p-4 label-caps text-white text-xs font-normal">Check-in</th>
              <th className="text-left p-4 label-caps text-white text-xs font-normal">Check-out</th>
              <th className="text-left p-4 label-caps text-white text-xs font-normal">Total</th>
              <th className="text-left p-4 label-caps text-white text-xs font-normal">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-b border-border last:border-0 hover:bg-bone/50 transition-colors">
                <td className="p-4">
                  <p className="text-charcoal">{b.guest_name}</p>
                  <p className="text-xs text-stone">{b.guest_email}</p>
                </td>
                <td className="p-4 text-stone">{b.property_name}</td>
                <td className="p-4 text-stone">{b.check_in}</td>
                <td className="p-4 text-stone">{b.check_out}</td>
                <td className="p-4 text-charcoal">€{b.total_price}</td>
                <td className="p-4">
                  <span className={`label-caps text-xs px-2 py-1 ${
                    b.status === "confirmed" ? "bg-green-50 text-green-700" :
                    b.status === "cancelled" ? "bg-red-50 text-red-700" :
                    b.status === "completed" ? "bg-blue-50 text-blue-700" :
                    "bg-yellow-50 text-yellow-700"
                  }`}>{b.status}</span>
                </td>
                <td className="p-4">
                  <button onClick={() => setSelected(b)} className="text-stone hover:text-charcoal">
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-stone">No bookings found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-light">Booking Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="label-caps text-stone text-xs">Guest</p><p className="text-charcoal">{selected.guest_name}</p></div>
                <div><p className="label-caps text-stone text-xs">Email</p><p className="text-charcoal">{selected.guest_email}</p></div>
                <div><p className="label-caps text-stone text-xs">Phone</p><p className="text-charcoal">{selected.guest_phone || "—"}</p></div>
                <div><p className="label-caps text-stone text-xs">Guests</p><p className="text-charcoal">{selected.guests}</p></div>
                <div><p className="label-caps text-stone text-xs">Total</p><p className="text-charcoal font-medium">€{selected.total_price}</p></div>
                <div><p className="label-caps text-stone text-xs">Payment</p><p className="text-charcoal">{selected.payment_method}</p></div>
              </div>
              {selected.special_requests && (
                <div><p className="label-caps text-stone text-xs">Special Requests</p><p className="text-charcoal">{selected.special_requests}</p></div>
              )}
              <div>
                <p className="label-caps text-stone text-xs mb-1">Internal Notes</p>
                <Textarea defaultValue={selected.internal_notes || ""} id="notes" rows={3} />
              </div>
              <div className="flex gap-3">
                <Select defaultValue={selected.status} onValueChange={(v) => updateMutation.mutate({ id: selected.id, data: { status: v } })}>
                  <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <button
                  onClick={() => {
                    const notes = document.getElementById("notes")?.value;
                    updateMutation.mutate({ id: selected.id, data: { internal_notes: notes } });
                  }}
                  className="label-caps px-5 py-2 bg-charcoal text-white hover:bg-ink transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}