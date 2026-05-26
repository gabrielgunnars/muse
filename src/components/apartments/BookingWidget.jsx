import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { differenceInDays, eachDayOfInterval, isWithinInterval, parseISO, format } from "date-fns";
import { CalendarDays, Users, Minus, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function BookingWidget({ property, bookings = [], blockedDates = [], seasonalPrices = [] }) {
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });
  const [guests, setGuests] = useState(2);
  const navigate = useNavigate();

  const disabledDates = useMemo(() => {
    const disabled = [];
    bookings
      .filter((b) => b.status !== "cancelled")
      .forEach((b) => {
        const days = eachDayOfInterval({ start: parseISO(b.check_in), end: parseISO(b.check_out) });
        disabled.push(...days);
      });
    blockedDates.forEach((bd) => {
      const days = eachDayOfInterval({ start: parseISO(bd.start_date), end: parseISO(bd.end_date) });
      disabled.push(...days);
    });
    return disabled;
  }, [bookings, blockedDates]);

  const getNightlyRate = (date) => {
    for (const sp of seasonalPrices) {
      if (isWithinInterval(date, { start: parseISO(sp.start_date), end: parseISO(sp.end_date) })) {
        return sp.nightly_rate;
      }
    }
    return property.base_nightly_rate;
  };

  const nights = dateRange.from && dateRange.to ? differenceInDays(dateRange.to, dateRange.from) : 0;

  const nightlyTotal = useMemo(() => {
    if (!dateRange.from || !dateRange.to || nights <= 0) return 0;
    const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to }).slice(0, -1);
    return days.reduce((sum, d) => sum + getNightlyRate(d), 0);
  }, [dateRange, nights, seasonalPrices, property]);

  const cleaningFee = property.cleaning_fee || 0;
  const tax = Math.round((nightlyTotal + cleaningFee) * (property.tax_rate || 0) / 100);
  const total = nightlyTotal + cleaningFee + tax;

  const handleBook = () => {
    if (!dateRange.from || !dateRange.to) return;
    const params = new URLSearchParams({
      checkIn: format(dateRange.from, "yyyy-MM-dd"),
      checkOut: format(dateRange.to, "yyyy-MM-dd"),
      guests: guests.toString(),
    });
    navigate(`/book/${property.slug}?${params.toString()}`);
  };

  return (
    <div className="bg-white p-6 lg:p-8 border border-border">
      <div className="flex items-baseline gap-2 mb-6">
        <span className="font-heading text-3xl text-charcoal">€{property.base_nightly_rate}</span>
        <span className="text-sm text-stone">/ night</span>
      </div>

      <div className="space-y-4">
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-full text-left border-b border-border pb-3 flex items-center gap-3">
              <CalendarDays size={18} className="text-clay" />
              <div>
                <p className="label-caps text-stone text-xs mb-1">Dates</p>
                <p className="text-sm text-charcoal">
                  {dateRange.from && dateRange.to
                    ? `${format(dateRange.from, "MMM d")} — ${format(dateRange.to, "MMM d")}`
                    : "Select dates"}
                </p>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              disabled={[{ before: new Date() }, ...disabledDates.map(d => d)]}
              numberOfMonths={2}
              className="rounded-sm"
            />
          </PopoverContent>
        </Popover>

        <div className="border-b border-border pb-3 flex items-center gap-3">
          <Users size={18} className="text-clay" />
          <div className="flex-1">
            <p className="label-caps text-stone text-xs mb-1">Guests</p>
            <div className="flex items-center gap-4">
              <button onClick={() => setGuests(Math.max(1, guests - 1))} className="text-stone hover:text-charcoal">
                <Minus size={16} />
              </button>
              <span className="text-sm text-charcoal w-4 text-center">{guests}</span>
              <button onClick={() => setGuests(Math.min(property.max_guests || 10, guests + 1))} className="text-stone hover:text-charcoal">
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {nights > 0 && (
          <div className="py-4 space-y-3 border-b border-border">
            <div className="flex justify-between text-sm">
              <span className="text-stone">€{Math.round(nightlyTotal / nights)} × {nights} night{nights > 1 ? "s" : ""}</span>
              <span className="text-charcoal">€{nightlyTotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone">Cleaning fee</span>
              <span className="text-charcoal">€{cleaningFee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone">Tax ({property.tax_rate || 0}%)</span>
              <span className="text-charcoal">€{tax}</span>
            </div>
            <div className="flex justify-between font-medium pt-2">
              <span className="text-charcoal">Total</span>
              <span className="font-heading text-xl text-charcoal">€{total}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleBook}
          disabled={!dateRange.from || !dateRange.to}
          className="w-full label-caps py-3.5 bg-charcoal text-white hover:bg-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {nights > 0 ? "Book Now" : "Select Dates"}
        </button>
      </div>
    </div>
  );
}