import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { format } from "date-fns";

const EASE = [0.25, 0.1, 0.25, 1];

const CATEGORY_LABELS = {
  "reykjavik-atmosphere": "Reykjavík Atmosphere",
  "winter-living": "Winter Living",
  "architecture-light": "Architecture & Light",
  "icelandic-rituals": "Icelandic Rituals",
  "slow-travel": "Slow Travel",
  "seasonal-guides": "Seasonal Guides",
  "design-interiors": "Design & Interiors",
};

const PLACEHOLDERS = [
  {
    id: "p1", slug: "#", title: "On Wintering in Reykjavík",
    excerpt: "What darkness teaches when you stop fighting it. A meditation on the shortest days.",
    category: "winter-living",
    hero_image: "https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=800",
  },
  {
    id: "p2", slug: "#", title: "The Art of the Slow Morning",
    excerpt: "Coffee, silence, and the particular quality of late-autumn light.",
    category: "icelandic-rituals",
    hero_image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
  },
  {
    id: "p3", slug: "#", title: "Architecture of Light",
    excerpt: "How Reykjavík's tin-roofed old town was shaped by weather and quiet radical intelligence.",
    category: "architecture-light",
    hero_image: "https://images.unsplash.com/photo-1504214208698-ea446addabbb?w=800",
  },
];

function ArticleCard({ article, index, isPlaceholder }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 1.4, delay: index * 0.1, ease: EASE }}
    >
      <Link to={isPlaceholder ? "#" : `/journal/${article.slug}`} className="block group">
        <div className="relative overflow-hidden aspect-[4/3] mb-5">
          <img
            src={article.hero_image}
            alt={article.title}
            className="w-full h-full object-cover img-cinematic transition-transform duration-[1800ms] ease-cinematic group-hover:scale-[1.02]"
          />
          {isPlaceholder && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0D0C0B]/40">
              <span className="label-caps text-bone/30 border border-bone/15 px-4 py-1.5">Coming soon</span>
            </div>
          )}
        </div>
        <p className="label-caps text-clay mb-2" style={{ fontSize: '0.6rem' }}>
          {CATEGORY_LABELS[article.category] || article.category}
        </p>
        <h3 className="font-heading text-2xl font-light text-bone mb-2 group-hover:text-bone/60 transition-colors duration-400">
          {article.title}
        </h3>
        {article.published_at && !isPlaceholder && (
          <p className="label-caps text-stone/40 mb-2" style={{ fontSize: '0.58rem' }}>
            {format(new Date(article.published_at), "d MMMM yyyy")}
          </p>
        )}
        <p className="text-stone text-sm leading-relaxed line-clamp-2">{article.excerpt}</p>
      </Link>
    </motion.div>
  );
}

export default function Journal() {
  const { data: articles = [] } = useQuery({
    queryKey: ["journal-published"],
    queryFn: () => base44.entities.JournalArticle.filter({ is_published: true }),
  });

  const display = articles.length > 0 ? articles : PLACEHOLDERS;
  const isPlaceholder = articles.length === 0;

  return (
    <div className="min-h-screen bg-ink pt-20">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
        >
          <p className="label-caps text-clay mb-6">The MUSE Journal</p>
          <h1 className="font-heading text-6xl lg:text-8xl font-light text-bone leading-none mb-8">
            Notes on<br />a city.
          </h1>
          <p className="text-stone text-sm leading-relaxed max-w-md">
            Seasonal guides, slow travel dispatches, architectural observations, and the kind of local knowledge that doesn't appear on maps.
          </p>
        </motion.div>
      </div>

      {/* Articles grid */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 pb-28 border-t border-warm pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {display.map((a, i) => (
            <ArticleCard
              key={a.id || i}
              article={a}
              index={i}
              isPlaceholder={isPlaceholder}
            />
          ))}
        </div>
      </div>
    </div>
  );
}