import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const ADMIN_PASSWORD = "Muse2026";

export default function AdminLayout() {
  const [entered, setEntered] = useState(() => sessionStorage.getItem("muse_admin") === "ok");
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  if (!entered) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <p className="font-heading text-4xl font-light text-bone tracking-brand mb-10">MUSE</p>
          <p className="label-caps text-stone mb-6">Admin Access</p>
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (input === ADMIN_PASSWORD) {
                  sessionStorage.setItem("muse_admin", "ok");
                  setEntered(true);
                } else {
                  setError(true);
                }
              }
            }}
            placeholder="Password"
            className="w-full bg-surface-raised border border-bone/10 text-bone placeholder:text-stone px-4 py-3 text-sm outline-none focus:border-clay/50 mb-4"
          />
          <button
            onClick={() => {
              if (input === ADMIN_PASSWORD) {
                sessionStorage.setItem("muse_admin", "ok");
                setEntered(true);
              } else {
                setError(true);
              }
            }}
            className="w-full bg-clay text-ink py-3 label-caps hover:bg-clay/90 transition-colors"
          >
            Enter
          </button>
          {error && <p className="text-red-400 text-xs mt-3">Incorrect password.</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}