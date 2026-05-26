import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FadeInSection from "../components/shared/FadeInSection";

const promptChips = [
  "Best coffee nearby",
  "Quiet bar for the evening",
  "Hidden bookshops",
  "Where locals eat",
  "Best walk from the apartment",
  "Gallery recommendations",
];

export default function Concierge() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const chatContainerRef = useRef(null);

  const { data: venues = [] } = useQuery({
    queryKey: ["concierge-venues"],
    queryFn: () => base44.entities.ConciergeVenue.filter({ is_active: true }),
  });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const venueList = venues
      .map((v) => `${v.name} (${v.category}, ${v.area}): ${v.description}`)
      .join("\n");

    const systemPrompt = `You are MUSE Reykjavík's personal concierge AI. You have warm, knowledgeable, and understated personality. You speak like a local friend, not a tour guide. Be concise and specific.

Here are the MUSE-curated venues and recommendations in Reykjavík:
${venueList}

Use these venues in your recommendations when relevant. You can also suggest other places you know.
Respond in the language the guest writes in. Keep responses brief and charming.`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `${systemPrompt}\n\nGuest: ${text}`,
    });

    setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    setLoading(false);
  };

  return (
    <div className="pt-20 min-h-screen bg-bone">
      <div className="max-w-3xl mx-auto px-6 py-16 flex flex-col" style={{ minHeight: "calc(100vh - 80px)" }}>
        <FadeInSection className="text-center mb-10">
          <p className="label-caps text-clay mb-2">Concierge</p>
          <h1 className="font-heading text-4xl lg:text-5xl font-light text-charcoal mb-3">
            Ask MUSE
          </h1>
          <p className="text-stone text-sm">Your personal guide to Reykjavík. Ask anything.</p>
        </FadeInSection>

        <div ref={chatContainerRef} className="flex-1 space-y-6 mb-8 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 340px)' }}>
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2 justify-center py-12">
              {promptChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className="label-caps px-4 py-2 border border-border hover:border-clay text-stone hover:text-charcoal transition-all text-xs"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-[80%] ${msg.role === "user" ? "ml-auto" : "mr-auto"}`}
              >
                <div
                  className={`p-4 ${
                    msg.role === "user"
                      ? "bg-rust text-white"
                      : "bg-cream text-charcoal border border-border"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
                <p className={`label-caps text-xs mt-1.5 ${msg.role === "user" ? "text-right" : ""} text-stone`}>
                  {msg.role === "user" ? "You" : "MUSE"}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[80%]">
              <div className="bg-white p-4 border border-border flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-clay" />
                <span className="text-sm text-stone">MUSE is thinking...</span>
              </div>
            </motion.div>
          )}
          <div ref={scrollRef} />
        </div>

        <div className="sticky bottom-0 bg-bone pt-4 pb-6">
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
            className="flex items-center gap-3 bg-cream border border-border p-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Reykjavík..."
              className="flex-1 bg-transparent text-sm text-charcoal placeholder:text-stone outline-none px-3 py-2"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 bg-charcoal text-white hover:bg-ink transition-colors disabled:opacity-30"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}