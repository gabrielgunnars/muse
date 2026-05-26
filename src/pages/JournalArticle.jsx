import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { ArrowLeft } from "lucide-react";

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

export default function JournalArticlePage() {
  const slug = window.location.pathname.split("/journal/")[1];

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["journal-article", slug],
    queryFn: () => base44.entities.JournalArticle.filter({ slug, is_published: true }),
  });

  const article = articles[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="w-6 h-6 border border-clay border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-ink flex flex-col items-center justify-center">
        <p className="font-heading text-3xl text-bone/40 mb-6">Article not found.</p>
        <Link to="/journal" className="label-caps text-clay hover:opacity-60 transition-opacity">
          Back to journal
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink">
      {/* Hero */}
      <div className="relative h-[70vh] overflow-hidden">
        <img
          src={article.hero_image}
          alt={article.title}
          className="w-full h-full object-cover img-cinematic"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0C0B]/40 via-transparent to-[#0D0C0B]/90" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, ease: EASE }}
          className="absolute bottom-12 left-0 right-0 px-6 lg:px-12 max-w-4xl mx-auto"
        >
          <p className="label-caps text-clay mb-4">{CATEGORY_LABELS[article.category] || article.category}</p>
          <h1 className="font-heading text-5xl lg:text-7xl font-light text-bone leading-none mb-4">
            {article.title}
          </h1>
          <p className="label-caps text-stone/50" style={{ fontSize: '0.6rem' }}>
            By {article.author || "MUSE"}
            {article.published_at && ` · ${format(new Date(article.published_at), "d MMMM yyyy")}`}
          </p>
        </motion.div>
      </div>

      {/* Body */}
      <div className="max-w-2xl mx-auto px-6 py-16 lg:py-24">
        <Link to="/journal" className="inline-flex items-center gap-2 label-caps text-stone/40 hover:text-stone transition-colors duration-400 mb-14">
          <ArrowLeft size={12} /> Back to journal
        </Link>

        {article.excerpt && (
          <p className="font-heading text-xl italic text-clay/80 leading-relaxed mb-10 border-l border-clay/30 pl-6">
            {article.excerpt}
          </p>
        )}

        <div className="prose prose-invert max-w-none text-stone text-[15px] leading-[1.9] [&>p]:mb-6 [&>h2]:font-heading [&>h2]:text-3xl [&>h2]:font-light [&>h2]:text-bone [&>h2]:mt-12 [&>h2]:mb-4 [&>blockquote]:border-l-2 [&>blockquote]:border-clay/40 [&>blockquote]:pl-6 [&>blockquote]:text-clay/70 [&>blockquote]:italic">
          <ReactMarkdown>{article.body || ""}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}