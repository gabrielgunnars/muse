import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";

const EASE = [0.25, 0.1, 0.25, 1];

const themes = [
  { label: "Slow mornings", desc: "Coffee, silence, fog." },
  { label: "Winter cafés", desc: "Warmth against the dark." },
  { label: "Hidden Reykjavík", desc: "Streets few maps show." },
  { label: "Storm evenings", desc: "When the city empties." },
  { label: "Old architecture", desc: "Tin roofs and history." },
  { label: "Light, always light", desc: "Northern skies, never quite dark." },
];

export default function CitySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 lg:py-36 px-6 lg:px-12 bg-warm-dark border-t border-warm">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.4, ease: EASE }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start"
        >
          {/* Left: image */}
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src="https://i0.wp.com/twinperspectives.co.uk/wp-content/uploads/707A1633-1-e1669038613785.jpg?w=581&h=872&ssl=1"
              alt="Reykjavík street"
              className="w-full h-full object-cover img-cinematic"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E1A16]/60 to-transparent" />
          </div>

          {/* Right: content */}
          <div className="flex flex-col justify-center">
            <p className="label-caps text-clay mb-6">Reykjavík through MUSE</p>
            <h2 className="font-heading text-4xl lg:text-5xl font-light text-bone leading-tight mb-8">
              The city's quieter side.
            </h2>
            <p className="text-stone text-sm leading-relaxed mb-12 max-w-sm">
              MUSE is not just a place to sleep. It is a perspective on a city that rewards those who move slowly, look closely, and arrive without a schedule.
            </p>

            <div className="grid grid-cols-2 gap-x-6 gap-y-6 mb-12">
              {themes.map((t, i) => (
                <motion.div
                  key={t.label}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 1.2, delay: 0.1 * i, ease: EASE }}
                >
                  <p className="text-bone/80 text-sm mb-0.5">{t.label}</p>
                  <p className="text-stone text-xs">{t.desc}</p>
                </motion.div>
              ))}
            </div>

            <Link
              to="/concierge"
              className="label-caps text-rust hover:opacity-60 transition-opacity duration-400 inline-block"
              style={{ fontSize: '0.65rem' }}
            >
              Your guide to Reykjavík's quieter side →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}