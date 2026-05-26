import React from "react";

export default function SectionLabel({ children, className = "" }) {
  return (
    <p className={`label-caps text-clay mb-4 ${className}`}>
      {children}
    </p>
  );
}