import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

const EASE = [0.25, 0.1, 0.25, 1];

function PropertyCard({ property, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 1.4, delay: index * 0.2, ease: EASE }}
    >
      <Link to={`/apartments/${property.slug}`} className="block group">
        <div className="relative overflow-hidden aspect-[3/4] mb-5">
          <img
            src={property.images?.[0]}
            alt={property.name}
            className="w-full h-full object-cover img-cinematic transition-transform duration-[1800ms] ease-cinematic group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0B]/70 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <p className="font-heading text-2xl font-light text-bone mb-1">{property.name}</p>
            <p className="label-caps text-bone/40" style={{ fontSize: '0.6rem' }}>
              {property.bedrooms} {property.bedrooms === 1 ? "bedroom" : "bedrooms"} · up to {property.max_guests} guests
            </p>
          </div>
        </div>
        <p className="text-stone text-sm leading-relaxed mb-4">{property.short_description}</p>
        <p className="label-caps text-clay transition-opacity duration-400 group-hover:opacity-60" style={{ fontSize: '0.65rem' }}>
          Enter →
        </p>
      </Link>
    </motion.div>
  );
}

export default function PropertiesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const { data: properties = [] } = useQuery({
    queryKey: ["properties-active"],
    queryFn: () => base44.entities.Property.filter({ is_active: true }),
  });

  return (
    <section className="py-24 lg:py-36 px-6 lg:px-12 bg-ink border-t border-warm">
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.4, ease: EASE }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 lg:mb-20 gap-6">
          <div>
            <p className="label-caps text-clay mb-4">Where to stay</p>
            <h2 className="font-heading text-5xl lg:text-6xl font-light text-bone leading-none">
              The Collector's<br />Houses
            </h2>
          </div>
          <p className="text-stone text-sm max-w-xs leading-relaxed">
            Each home shaped by decades of objects, light, and quiet. Private residences, opened for those who stay with intention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {properties.map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.4, delay: 0.6, ease: EASE }}
          className="text-center mt-16"
        >
          <Link
            to="/apartments"
            className="label-caps px-10 py-3.5 border border-bone/20 text-bone/50 hover:border-clay hover:text-clay transition-all duration-[600ms]"
          >
            View all homes
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}