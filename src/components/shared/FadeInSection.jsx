import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.25, 0.1, 0.25, 1];

export default function FadeInSection({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1.4, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}