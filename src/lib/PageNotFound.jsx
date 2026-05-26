import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-charcoal flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center"
      >
        <p className="font-heading text-8xl font-light text-white/10 tracking-brand mb-6">
          MUSE
        </p>
        <p className="label-caps text-white/30 mb-4">404</p>
        <h1 className="font-heading text-3xl lg:text-4xl font-light text-white mb-4">
          This page doesn't exist
        </h1>
        <p className="text-white/40 text-sm mb-10 max-w-sm mx-auto">
          Like the best of Reykjavík's secrets, some things are meant to be discovered differently.
        </p>
        <Link
          to="/"
          className="label-caps px-8 py-3 border border-white/30 text-white/60 hover:border-white hover:text-white transition-all"
        >
          Return Home
        </Link>
      </motion.div>
    </div>
  );
}