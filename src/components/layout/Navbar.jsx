import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.25, 0.1, 0.25, 1];

const navLinks = [
  { label: "Where to stay", path: "/apartments" },
  { label: "Concierge", path: "/concierge" },
  { label: "Journal", path: "/journal" },
  { label: "City Guide", path: "/city-guide" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  const atTop = isHome && !scrolled;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-[800ms] ease-cinematic ${
          atTop
            ? "bg-transparent"
            : "bg-[#0D0C0B]/90 backdrop-blur-md border-b border-warm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16 lg:h-20">
          <Link
            to="/"
            className="font-heading text-xl font-light tracking-[0.3em] text-bone transition-opacity duration-400 hover:opacity-60"
          >
            MUSE
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="label-caps text-bone/50 hover:text-bone transition-colors duration-400"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/apartments"
              className="hidden md:inline-block label-caps px-6 py-2 border border-bone/20 text-bone/40 hover:border-clay hover:text-clay transition-all duration-[600ms]"
            >
              Reserve
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden text-bone/60 hover:text-bone transition-colors duration-400"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="fixed inset-0 z-40 bg-[#0D0C0B] flex flex-col items-start justify-center px-10 gap-10"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-5 right-6 text-bone/40 hover:text-bone transition-colors duration-400"
            >
              <X size={22} />
            </button>

            <p className="font-heading text-5xl font-light tracking-[0.3em] text-bone/20 mb-4">MUSE</p>

            {navLinks.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.8, ease: EASE }}
              >
                <Link
                  to={link.path}
                  className="font-heading text-4xl md:text-5xl font-light text-bone hover:text-clay transition-colors duration-400 tracking-wide"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
              className="mt-6"
            >
              <Link
                to="/apartments"
                className="label-caps px-8 py-3 border border-bone/20 text-bone/40 hover:border-clay hover:text-clay transition-all duration-[600ms]"
              >
                Reserve your stay
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}