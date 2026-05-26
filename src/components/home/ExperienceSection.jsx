import React from "react";
import { Paintbrush, MapPin, Sparkles, Heart, Leaf } from "lucide-react";
import FadeInSection from "../shared/FadeInSection";
import SectionLabel from "../shared/SectionLabel";

const experiences = [
  { icon: Paintbrush, label: "Design Led", description: "Every space curated with intention" },
  { icon: MapPin, label: "Locally Curated", description: "Neighbourhood knowledge, not guidebooks" },
  { icon: Sparkles, label: "Effortless", description: "Everything you need, nothing you don't" },
  { icon: Heart, label: "Personal", description: "A host, not a helpdesk" },
  { icon: Leaf, label: "Sustainable", description: "Mindful choices, meaningful stays" },
];

export default function ExperienceSection() {
  return (
    <section className="py-24 lg:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <FadeInSection className="text-center mb-16">
          <SectionLabel className="text-center">The Experience</SectionLabel>
          <h2 className="font-heading text-4xl lg:text-5xl font-light text-charcoal">
            What makes MUSE different
          </h2>
        </FadeInSection>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {experiences.map((exp, i) => (
            <FadeInSection key={exp.label} delay={i * 0.1} className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <exp.icon size={28} className="text-rust" strokeWidth={1.5} />
              </div>
              <p className="label-caps text-charcoal mb-2">{exp.label}</p>
              <p className="text-xs text-stone leading-relaxed">{exp.description}</p>
            </FadeInSection>
          ))}
        </div>

        <FadeInSection delay={0.5} className="mt-24 text-center max-w-2xl mx-auto">
          <p className="font-heading text-2xl lg:text-3xl font-light text-charcoal leading-relaxed italic">
            "MUSE is not a rental. It's a place with a point of view."
          </p>
        </FadeInSection>
      </div>
    </section>
  );
}