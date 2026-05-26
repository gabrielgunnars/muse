import React from "react";
import HeroSection from "../components/home/HeroSection";
import AtmosphereSection from "../components/home/AtmosphereSection";
import PropertiesSection from "../components/home/PropertiesSection";
import CitySection from "../components/home/CitySection";
import JournalSection from "../components/home/JournalSection";
import BookingSection from "../components/home/BookingSection";

export default function Home() {
  return (
    <div className="bg-ink">
      <HeroSection />
      <AtmosphereSection />
      <PropertiesSection />
      <CitySection />
      <JournalSection />
      <BookingSection />
    </div>
  );
}