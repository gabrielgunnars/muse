import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

const EASE = [0.25, 0.1, 0.25, 1];

const FALLBACK_IMAGES = [
{
  src: "https://images.unsplash.com/photo-1504457047772-27faf1c00561?w=1200",
  caption: "Dusk over the old harbour, November."
},
{
  src: "https://images.unsplash.com/photo-1529963183134-61a90db47eaf?w=900",
  caption: "Winter light, Reykjavík rooftops."
},
];


function FadeImage({ src, caption, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 1.6, delay, ease: EASE }}
      className="flex flex-col">
      
      <div className="relative overflow-hidden group">
        <img
          src={src}
          alt={caption}
          className="w-full h-full object-cover img-cinematic transition-transform duration-[1800ms] ease-cinematic group-hover:scale-[1.02]" />
      </div>
      
      {caption &&
        <p className="label-caps text-bone/40 mt-3" style={{ fontSize: '0.6rem' }}>
          {caption}
        </p>
      }
    </motion.div>
  );
}

export default function AtmosphereSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const { data: dbImages = [] } = useQuery({
    queryKey: ["site-images", "atmosphere"],
    queryFn: () => base44.entities.SiteImage.filter({ section: "atmosphere" }, "position", 20)
  });

  // Merge: use DB images where available, fill remaining slots with fallbacks
  const images = [0, 1].map((i) => dbImages[i] ?? FALLBACK_IMAGES[i]);

  return (
    <section className="py-24 lg:py-36 px-6 lg:px-12 bg-ink">
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.4, ease: EASE }}
        className="max-w-xs mx-auto text-center mb-16 lg:mb-24">
        
        <p className="label-caps text-clay mb-5">Light & Atmosphere</p>
        <p className="font-heading text-2xl lg:text-3xl font-light text-bone/80 italic leading-relaxed">
          Iceland changes the way time feels.
        </p>
      </motion.div>

      {/* Editorial image layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
        <div className="h-[60vw] md:h-[500px] min-h-[400px]">
          <FadeImage src={images[0].src} caption={images[0].caption} delay={0} />
        </div>
        <div className="h-[60vw] md:h-[500px] min-h-[400px]">
          <FadeImage src={images[1].src} caption={images[1].caption} delay={0.3} />
        </div>
      </div>
    </section>
  );
}