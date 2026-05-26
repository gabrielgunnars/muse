import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#0D0C0B] border-t border-warm pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <p className="font-heading text-5xl font-light text-bone tracking-[0.3em] mb-4">
              MUSE
            </p>
            <p className="font-body text-sm text-stone leading-relaxed max-w-xs">
              A place to stay. A point of view.<br />
              Reykjavík, Iceland.
            </p>
            <p className="font-body text-xs text-stone/40 mt-8 leading-relaxed">
              Skólavörðustígur 28<br />
              101 Reykjavík
            </p>
          </div>

          <div>
            <p className="label-caps text-stone/40 mb-6">Explore</p>
            <div className="flex flex-col gap-3.5">
              {[
                { label: "Where to stay", path: "/apartments" },
                { label: "Concierge", path: "/concierge" },
                { label: "City Guide", path: "/city-guide" },
                { label: "Journal", path: "/journal" },
                { label: "Gift cards", path: "/gift-cards" },
              ].map(l => (
                <Link key={l.path} to={l.path} className="text-sm text-stone hover:text-bone transition-colors duration-400">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="label-caps text-stone/40 mb-6">Get in touch</p>
            <div className="flex flex-col gap-3.5 text-sm">
              <a href="mailto:olof@norrlighting.is" className="text-stone hover:text-bone transition-colors duration-400">
                olof@norrlighting.is
              </a>
              <a href="tel:+3548956563" className="text-stone hover:text-bone transition-colors duration-400">
                +354 895 6563
              </a>
              <a
                href="https://instagram.com/muse_reykjavik"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone hover:text-bone transition-colors duration-400"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-warm pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-stone/30">
            © {new Date().getFullYear()} MUSE Reykjavík. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/my-stay" className="text-xs text-stone/30 hover:text-stone/60 transition-colors duration-400">
              My stay
            </Link>
            <Link to="/admin" className="text-xs text-stone/30 hover:text-stone/60 transition-colors duration-400">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}