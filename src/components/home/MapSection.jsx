import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import FadeInSection from "../shared/FadeInSection";
import SectionLabel from "../shared/SectionLabel";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const museIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:32px;height:32px;background:#1A1A1A;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:300;letter-spacing:0.1em;border:2px solid #BDAA83">M</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const categoryColors = {
  coffee: "#BDAA83",
  restaurant: "#F2EFEA",
  bar: "#1A1A1A",
  bookshop: "#8B8B7F",
  gallery: "#BDAA83",
  nature: "#6B8F71",
  shop: "#8B8B7F",
};

const venueIcon = (category) =>
  new L.DivIcon({
    className: "",
    html: `<div style="width:12px;height:12px;background:${categoryColors[category] || "#8B8B7F"};border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });

export default function MapSection() {
  const { data: properties = [] } = useQuery({
    queryKey: ["properties-map"],
    queryFn: () => base44.entities.Property.filter({ is_active: true }),
  });

  const { data: venues = [] } = useQuery({
    queryKey: ["venues-map"],
    queryFn: () => base44.entities.ConciergeVenue.filter({ is_active: true }),
  });

  return (
    <section className="py-24 lg:py-32 bg-charcoal">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <FadeInSection className="mb-12">
          <SectionLabel>Discover</SectionLabel>
          <h2 className="font-heading text-4xl lg:text-5xl font-light text-white">
            Find Us in Reykjavík
          </h2>
        </FadeInSection>

        <FadeInSection delay={0.2}>
          <div className="h-[500px] rounded-sm overflow-hidden">
            <MapContainer
              center={[64.147, -21.935]}
              zoom={14}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              />
              {properties.map((p) =>
                p.lat && p.lng ? (
                  <Marker key={p.id} position={[p.lat, p.lng]} icon={museIcon}>
                    <Popup>
                      <div className="font-body text-sm">
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-stone">{p.address}</p>
                      </div>
                    </Popup>
                  </Marker>
                ) : null
              )}
              {venues.map((v) =>
                v.lat && v.lng ? (
                  <Marker key={v.id} position={[v.lat, v.lng]} icon={venueIcon(v.category)}>
                    <Popup>
                      <div className="font-body text-sm">
                        <p className="label-caps text-xs mb-1">{v.category}</p>
                        <p className="font-medium">{v.name}</p>
                        <p className="text-xs text-stone">{v.description}</p>
                      </div>
                    </Popup>
                  </Marker>
                ) : null
              )}
            </MapContainer>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}