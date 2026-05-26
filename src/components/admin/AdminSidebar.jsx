import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Building2, CalendarDays, Calendar, MessageSquare, Star, Gift, Users, BookOpen, Image } from "lucide-react";

const links = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Properties", path: "/admin/properties", icon: Building2 },
  { label: "Bookings", path: "/admin/bookings", icon: CalendarDays },
  { label: "Calendar", path: "/admin/calendar", icon: Calendar },
  { label: "Concierge", path: "/admin/concierge", icon: MessageSquare },
  { label: "Reviews", path: "/admin/reviews", icon: Star },
  { label: "Gift Cards", path: "/admin/gift-cards", icon: Gift },
  { label: "Guests", path: "/admin/guests", icon: Users },
  { label: "Journal", path: "/admin/journal", icon: BookOpen },
  { label: "Home Images", path: "/admin/home-images", icon: Image },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-charcoal flex flex-col">
      <div className="p-6">
        <Link to="/" className="font-heading text-2xl font-light text-white tracking-brand">
          MUSE
        </Link>
        <p className="label-caps text-white/30 mt-1 text-[10px]">Admin</p>
      </div>
      <nav className="flex-1 px-3">
        {links.map((link) => {
          const active = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-sm mb-0.5 text-sm transition-all ${
                active ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`}
            >
              <link.icon size={16} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-6">
        <Link to="/" className="text-xs text-white/30 hover:text-white/60 transition-colors">
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}