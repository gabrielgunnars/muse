import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ImageGallery({ images = [] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  if (images.length === 0) return null;

  const next = () => setCurrent((c) => (c + 1) % images.length);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 cursor-pointer" onClick={() => setLightboxOpen(true)}>
        <div className="md:col-span-2 aspect-[16/10] overflow-hidden">
          <img src={images[0]} alt="Main" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
        </div>
        <div className="hidden md:grid grid-rows-2 gap-2">
          {images.slice(1, 3).map((img, i) => (
            <div key={i} className="overflow-hidden">
              <img src={img} alt={`View ${i + 2}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          ))}
        </div>
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl bg-black border-none p-0">
          <div className="relative">
            <button onClick={() => setLightboxOpen(false)} className="absolute top-4 right-4 z-10 text-white/70 hover:text-white">
              <X size={24} />
            </button>
            <AnimatePresence mode="wait">
              <motion.img
                key={current}
                src={images[current]}
                alt=""
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-h-[80vh] object-contain"
              />
            </AnimatePresence>
            {images.length > 1 && (
              <>
                <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white">
                  <ChevronLeft size={32} />
                </button>
                <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white">
                  <ChevronRight size={32} />
                </button>
              </>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-white" : "bg-white/30"}`}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}