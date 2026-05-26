import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { format, differenceInDays, eachDayOfInterval, isWithinInterval, parseISO } from "date-fns";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2 } from "lucide-react";
import FadeInSection from "../components/shared/FadeInSection";

export default function BookingFlow() {
  const slug = window.location.pathname.split("/book/")[1];
  const urlParams = new URLSearchParams(window.location.search);
  const checkIn = urlParams.get("checkIn");
  const checkOut = urlParams.get("checkOut");
  const guestCount = parseInt(urlParams.get("guests") || "2");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    guest_name: "", guest_email: "", guest_phone: "", special_requests: "", gift_card_code: "",
  });
  const [payMethod, setPayMethod] = useState("online");
  const [success, setSuccess] = useState(false);

  const { data: properties = [] } = useQuery({
    queryKey: ["book-property", slug],
    queryFn: () => base44.entities.Property.filter({ slug }),
  });
  const property = properties[0];

  const { data: seasonalPrices = [] } = useQuery({
    queryKey: ["book-seasonal", property?.id],
    queryFn: () => base44.entities.SeasonalPrice.filter({ property_id: property.id }),
    enabled: !!property?.id,
  });

  const nights = checkIn && checkOut ? differenceInDays(parseISO(checkOut), parseISO(checkIn)) : 0;

  const getNightlyRate = (date) => {
    for (const sp of seasonalPrices) {
      if (isWithinInterval(date, { start: parseISO(sp.start_date), end: parseISO(sp.end_date) })) return sp.nightly_rate;
    }
    return property?.base_nightly_rate || 0;
  };

  const nightlyTotal = checkIn && checkOut && nights > 0
    ? eachDayOfInterval({ start: parseISO(checkIn), end: parseISO(checkOut) }).slice(0, -1).reduce((s, d) => s + getNightlyRate(d), 0)
    : 0;

  const cleaningFee = property?.cleaning_fee || 0;
  const tax = Math.round((nightlyTotal + cleaningFee) * (property?.tax_rate || 0) / 100);
  const total = nightlyTotal + cleaningFee + tax;

  const createBooking = useMutation({
    mutationFn: (data) => base44.entities.Booking.create(data),
    onSuccess: async (booking) => {
      setSuccess(true);
      await base44.integrations.Core.SendEmail({
        to: form.guest_email,
        subject: `MUSE — Booking Confirmation for ${property.name}`,
        body: `Dear ${form.guest_name},\n\nYour booking at ${property.name} is confirmed.\n\nCheck-in: ${format(parseISO(checkIn), "MMMM d, yyyy")}\nCheck-out: ${format(parseISO(checkOut), "MMMM d, yyyy")}\nGuests: ${guestCount}\nTotal: €${total}\n\nWe look forward to welcoming you.\n\nWarm regards,\nMUSE Reykjavík`,
        from_name: "MUSE Reykjavík",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createBooking.mutate({
      property_id: property.id,
      property_name: property.name,
      guest_name: form.guest_name,
      guest_email: form.guest_email,
      guest_phone: form.guest_phone,
      check_in: checkIn,
      check_out: checkOut,
      guests: guestCount,
      nightly_total: nightlyTotal,
      cleaning_fee: cleaningFee,
      tax,
      total_price: total,
      status: "confirmed",
      payment_method: payMethod,
      gift_card_code: form.gift_card_code || undefined,
      special_requests: form.special_requests || undefined,
    });
  };

  if (success) {
    return (
      <div className="pt-20 min-h-screen bg-bone flex items-center justify-center px-6">
        <FadeInSection className="text-center max-w-md">
          <CheckCircle size={48} className="text-clay mx-auto mb-6" strokeWidth={1} />
          <h1 className="font-heading text-4xl text-charcoal mb-4">Booking Confirmed</h1>
          <p className="text-stone leading-relaxed mb-2">
            A confirmation email has been sent to {form.guest_email}.
          </p>
          <p className="text-stone leading-relaxed mb-8">
            We look forward to welcoming you to {property?.name}.
          </p>
          <button onClick={() => navigate("/")} className="label-caps px-8 py-3 border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-all">
            Return Home
          </button>
        </FadeInSection>
      </div>
    );
  }

  if (!property) {
    return <div className="pt-20 min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-clay border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="pt-20 min-h-screen bg-bone">
      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16">
        <FadeInSection>
          <p className="label-caps text-clay mb-2">Book</p>
          <h1 className="font-heading text-4xl lg:text-5xl font-light text-charcoal mb-12">{property.name}</h1>
        </FadeInSection>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
            <FadeInSection delay={0.1}>
              <div className="bg-white p-6 space-y-5">
                <h2 className="label-caps text-charcoal mb-4">Guest Details</h2>
                <div>
                  <Label className="label-caps text-stone text-xs">Full Name</Label>
                  <Input required value={form.guest_name} onChange={(e) => setForm({...form, guest_name: e.target.value})}
                    className="border-0 border-b border-border rounded-none bg-transparent focus-visible:ring-0 px-0" />
                </div>
                <div>
                  <Label className="label-caps text-stone text-xs">Email</Label>
                  <Input required type="email" value={form.guest_email} onChange={(e) => setForm({...form, guest_email: e.target.value})}
                    className="border-0 border-b border-border rounded-none bg-transparent focus-visible:ring-0 px-0" />
                </div>
                <div>
                  <Label className="label-caps text-stone text-xs">Phone</Label>
                  <Input value={form.guest_phone} onChange={(e) => setForm({...form, guest_phone: e.target.value})}
                    className="border-0 border-b border-border rounded-none bg-transparent focus-visible:ring-0 px-0" />
                </div>
                <div>
                  <Label className="label-caps text-stone text-xs">Special Requests</Label>
                  <Textarea value={form.special_requests} onChange={(e) => setForm({...form, special_requests: e.target.value})}
                    className="border-0 border-b border-border rounded-none bg-transparent focus-visible:ring-0 px-0 resize-none" rows={3} />
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <div className="bg-white p-6 space-y-4">
                <h2 className="label-caps text-charcoal mb-4">Payment</h2>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setPayMethod("online")}
                    className={`flex-1 py-3 border text-sm transition-all ${payMethod === "online" ? "border-charcoal bg-charcoal text-white" : "border-border text-stone hover:border-charcoal"}`}>
                    Pay Now
                  </button>
                  {property.pay_on_arrival && (
                    <button type="button" onClick={() => setPayMethod("pay_on_arrival")}
                      className={`flex-1 py-3 border text-sm transition-all ${payMethod === "pay_on_arrival" ? "border-charcoal bg-charcoal text-white" : "border-border text-stone hover:border-charcoal"}`}>
                      Pay on Arrival
                    </button>
                  )}
                </div>
                <div>
                  <Label className="label-caps text-stone text-xs">Gift Card / Voucher Code</Label>
                  <Input value={form.gift_card_code} onChange={(e) => setForm({...form, gift_card_code: e.target.value})}
                    placeholder="Optional" className="border-0 border-b border-border rounded-none bg-transparent focus-visible:ring-0 px-0" />
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.3}>
              <button type="submit" disabled={createBooking.isPending}
                className="w-full label-caps py-4 bg-charcoal text-white hover:bg-ink transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {createBooking.isPending && <Loader2 size={16} className="animate-spin" />}
                Confirm Booking — €{total}
              </button>
            </FadeInSection>
          </form>

          <FadeInSection delay={0.15} className="lg:col-span-2">
            <div className="bg-white p-6 lg:sticky lg:top-28">
              <h2 className="label-caps text-charcoal mb-6">Booking Summary</h2>
              <div className="flex gap-4 mb-6 pb-6 border-b border-border">
                <img src={property.images?.[0]} alt="" className="w-24 h-20 object-cover" />
                <div>
                  <p className="font-heading text-lg text-charcoal">{property.name}</p>
                  <p className="text-xs text-stone">{property.address}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-stone">Check-in</span><span className="text-charcoal">{checkIn && format(parseISO(checkIn), "MMM d, yyyy")}</span></div>
                <div className="flex justify-between"><span className="text-stone">Check-out</span><span className="text-charcoal">{checkOut && format(parseISO(checkOut), "MMM d, yyyy")}</span></div>
                <div className="flex justify-between"><span className="text-stone">Guests</span><span className="text-charcoal">{guestCount}</span></div>
                <div className="flex justify-between"><span className="text-stone">Nights</span><span className="text-charcoal">{nights}</span></div>
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between"><span className="text-stone">Nightly total</span><span>€{nightlyTotal}</span></div>
                  <div className="flex justify-between mt-1"><span className="text-stone">Cleaning fee</span><span>€{cleaningFee}</span></div>
                  <div className="flex justify-between mt-1"><span className="text-stone">Tax</span><span>€{tax}</span></div>
                </div>
                <div className="flex justify-between font-medium border-t border-border pt-3 mt-3">
                  <span className="text-charcoal">Total</span>
                  <span className="font-heading text-xl text-charcoal">€{total}</span>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </div>
  );
}