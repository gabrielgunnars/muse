import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";

const EASE = [0.25, 0.1, 0.25, 1];

export default function HeroSection() {
  const { data: heroImages = [] } = useQuery({
    queryKey: ["site-images", "hero"],
    queryFn: () => base44.entities.SiteImage.filter({ section: "hero" }, "position", 1),
  });
  const heroSrc = heroImages[0]?.src;

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-ink" />
      {heroSrc && (
        <img
          src={heroSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40 img-cinematic"
        />
      )}

      {/* Central content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.0, delay: 0.4, ease: EASE }}
          className="font-heading text-[80px] md:text-[120px] lg:text-[160px] font-light text-bone leading-none tracking-[0.25em] mb-8"
        >
          MUSE
        </motion.h1>


      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 2.2, ease: EASE }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
      >
        <div className="w-px h-12 bg-bone/20 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-clay/60"
            animate={{ height: ["0%", "100%"], top: ["0%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
          />
        </div>
        <p className="label-caps text-bone/30" style={{ fontSize: '0.6rem' }}>Scroll</p>
      </motion.div>
    </section>
  );
}