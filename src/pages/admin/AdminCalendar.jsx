import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isWithinInterval, parseISO, isSameMonth, getDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

const propertyColors = ["bg-clay", "bg-stone", "bg-charcoal"];

export default function AdminCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { data: properties = [] } = useQuery({
    queryKey: ["cal-properties"],
    queryFn: () => base44.entities.Property.filter({ is_active: true }),
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["cal-bookings"],
    queryFn: () => base44.entities.Booking.list("-created_date", 500),
  });

  const { data: blockedDates = [] } = useQuery({
    queryKey: ["cal-blocked"],
    queryFn: () => base44.entities.BlockedDate.list(),
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDow = getDay(monthStart);

  const getBookingsForDay = (day) => {
    return bookings.filter((b) => {
      if (b.status === "cancelled") return false;
      return isWithinInterval(day, { start: parseISO(b.check_in), end: parseISO(b.check_out) });
    });
  };

  const getBlocksForDay = (day) => {
    return blockedDates.filter((bd) =>
      isWithinInterval(day, { start: parseISO(bd.start_date), end: parseISO(bd.end_date) })
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-light text-bone">Calendar</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="text-stone hover:text-charcoal">
            <ChevronLeft size={20} />
          </button>
          <span className="font-heading text-xl text-charcoal min-w-[180px] text-center">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="text-stone hover:text-charcoal">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        {properties.map((p, i) => (
          <div key={p.id} className="flex items-center gap-2 text-xs">
            <div className={`w-3 h-3 rounded-full ${propertyColors[i % propertyColors.length]}`} />
            <span className="text-stone">{p.name}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-red-300" />
          <span className="text-stone">Blocked</span>
        </div>
      </div>

      <div className="bg-white border border-border">
        <div className="grid grid-cols-7">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="p-3 text-center label-caps text-stone text-xs border-b border-border">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: startDow }).map((_, i) => (
            <div key={`empty-${i}`} className="p-3 min-h-[80px] border-b border-r border-border bg-bone/50" />
          ))}
          {days.map((day) => {
            const dayBookings = getBookingsForDay(day);
            const dayBlocks = getBlocksForDay(day);
            return (
              <div key={day.toISOString()} className="p-2 min-h-[80px] border-b border-r border-border">
                <p className="text-xs text-stone mb-1">{format(day, "d")}</p>
                <div className="space-y-0.5">
                  {dayBookings.map((b) => {
                    const propIdx = properties.findIndex((p) => p.id === b.property_id);
                    return (
                      <div key={b.id} className={`text-[10px] text-white px-1 py-0.5 truncate ${propertyColors[propIdx % propertyColors.length]}`}>
                        {b.guest_name}
                      </div>
                    );
                  })}
                  {dayBlocks.map((bd) => (
                    <div key={bd.id} className="text-[10px] text-red-700 bg-red-100 px-1 py-0.5 truncate">
                      {bd.reason || "Blocked"}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}