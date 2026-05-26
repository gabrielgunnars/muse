import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EASE = [0.25, 0.1, 0.25, 1];

export default function BookingSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const navigate = useNavigate();

  const [selectedProperty, setSelectedProperty] = useState("");
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });

  const { data: properties = [] } = useQuery({
    queryKey: ["properties-active"],
    queryFn: () => base44.entities.Property.filter({ is_active: true }),
  });

  const handleFind = () => {
    if (!selectedProperty) return;
    const property = properties.find(p => p.id === selectedProperty);
    if (!property) return;
    const params = new URLSearchParams();
    if (dateRange.from) params.set("checkIn", format(dateRange.from, "yyyy-MM-dd"));
    if (dateRange.to) params.set("checkOut", format(dateRange.to, "yyyy-MM-dd"));
    navigate(`/apartments/${property.slug}?${params.toString()}`);
  };

  return (
    <section className="py-24 lg:py-36 px-6 lg:px-12 bg-warm-dark border-t border-warm">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.4, ease: EASE }}
        >
          <p className="label-caps text-clay mb-6">Reserve your stay</p>
          <h2 className="font-heading text-5xl lg:text-6xl font-light text-bone leading-none mb-6">
            Ready to arrive?
          </h2>
          <p className="text-stone text-sm leading-relaxed max-w-sm mx-auto mb-14">
            Choose your home, find your dates. Everything else will be taken care of.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
          className="flex flex-col md:flex-row items-stretch gap-0 border border-warm"
        >
          {/* Property selector */}
          <div className="flex-1 border-b md:border-b-0 md:border-r border-warm">
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger className="h-14 rounded-none border-0 bg-transparent text-bone/70 label-caps focus:ring-0 focus:ring-offset-0 px-6" style={{ fontSize: '0.65rem' }}>
                <SelectValue placeholder="Choose a home" />
              </SelectTrigger>
              <SelectContent className="bg-[#1E1A16] border-warm text-bone">
                {properties.map(p => (
                  <SelectItem key={p.id} value={p.id} className="label-caps focus:bg-warm-dark" style={{ fontSize: '0.65rem' }}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date picker */}
          <div className="flex-1 border-b md:border-b-0 md:border-r border-warm">
            <Popover>
              <PopoverTrigger asChild>
                <button className="w-full h-14 px-6 label-caps text-bone/50 hover:text-bone/80 transition-colors duration-400 text-left" style={{ fontSize: '0.65rem' }}>
                  {dateRange.from && dateRange.to
                    ? `${format(dateRange.from, "MMM d")} — ${format(dateRange.to, "MMM d")}`
                    : "Find your dates"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-[#1E1A16] border-warm" align="center">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  disabled={[{ before: new Date() }]}
                  numberOfMonths={2}
                  className="text-bone"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* CTA */}
          <button
            onClick={handleFind}
            disabled={!selectedProperty}
            className="h-14 px-8 label-caps bg-rust text-white hover:bg-[#A24830] transition-colors duration-[600ms] disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ fontSize: '0.65rem' }}
          >
            Continue →
          </button>
        </motion.div>
      </div>
    </section>
  );
}