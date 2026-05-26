import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

const EASE = [0.25, 0.1, 0.25, 1];

const PLACEHOLDERS = [
  {
    slug: "winter-in-reykjavik",
    title: "On Wintering in Reykjavík",
    excerpt: "What darkness teaches when you stop fighting it. A meditation on the shortest days in the northernmost capital.",
    category: "Winter Living",
    hero_image: "https://images.unsplash.com/photo-1529963183134-61a90db47eaf?w=800",
  },
  {
    slug: "slow-mornings",
    title: "The Art of the Slow Morning",
    excerpt: "Coffee, silence, and the particular quality of Reykjavík light in late autumn. A guide to doing very little, beautifully.",
    category: "Icelandic Rituals",
    hero_image: "https://images.unsplash.com/photo-1504457047772-27faf1c00561?w=800",
  },
  {
    slug: "architecture-of-light",
    title: "Architecture of Light",
    excerpt: "How Reykjavík's tin-roofed old town was shaped by weather, necessity, and a quietly radical aesthetic intelligence.",
    category: "Architecture & Light",
    hero_image: "https://images.unsplash.com/photo-1517971053567-8bde93bc6a58?w=800",
  },
];

function ArticleCard({ article, index, isPlaceholder = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 1.4, delay: index * 0.15, ease: EASE }}
    >
      <Link to={isPlaceholder ? "/journal" : `/journal/${article.slug}`} className="block group">
        <div className="relative overflow-hidden aspect-[4/3] mb-5">
          <img
            src={article.hero_image}
            alt={article.title}
            className="w-full h-full object-cover img-cinematic transition-transform duration-[1800ms] ease-cinematic group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0B]/50 to-transparent" />
          {isPlaceholder && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="label-caps text-bone/30 border border-bone/20 px-4 py-1.5">Coming soon</span>
            </div>
          )}
        </div>
        <p className="label-caps text-clay mb-2" style={{ fontSize: '0.6rem' }}>{article.category}</p>
        <h3 className="font-heading text-xl font-light text-bone mb-2 group-hover:text-bone/70 transition-colors duration-400">
          {article.title}
        </h3>
        <p className="text-stone text-xs leading-relaxed line-clamp-2">{article.excerpt}</p>
      </Link>
    </motion.div>
  );
}

export default function JournalSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const { data: articles = [] } = useQuery({
    queryKey: ["journal-published"],
    queryFn: () => base44.entities.JournalArticle.filter({ is_published: true }),
  });

  const display = articles.length >= 3
    ? articles.slice(0, 3)
    : PLACEHOLDERS;

  const isPlaceholder = articles.length < 3;

  return (
    <section className="py-24 lg:py-36 px-6 lg:px-12 bg-ink border-t border-warm">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.4, ease: EASE }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-14 lg:mb-20 gap-6"
        >
          <div>
            <p className="label-caps text-clay mb-4">From the journal</p>
            <h2 className="font-heading text-5xl lg:text-6xl font-light text-bone leading-none">
              Notes on<br />a city.
            </h2>
          </div>
          <Link
            to="/journal"
            className="label-caps text-stone hover:text-clay transition-colors duration-400 self-start md:self-auto"
            style={{ fontSize: '0.65rem' }}
          >
            All writing →
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {display.map((a, i) => (
            <ArticleCard
              key={a.slug || i}
              article={a}
              index={i}
              isPlaceholder={isPlaceholder}
            />
          ))}
        </div>
      </div>
    </section>
  );
}