import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, ImageOff } from "lucide-react";

export default function PropertyImageEditor({ images, onChange }) {
  const [inputUrl, setInputUrl] = useState("");

  const addImage = () => {
    const url = inputUrl.trim();
    if (!url) return;
    onChange([...images, url]);
    setInputUrl("");
  };

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <Label className="text-xs mb-2 block">Images</Label>

      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((url, i) => (
            <div key={i} className="relative group w-24 h-20 flex-shrink-0">
              <img
                src={url}
                alt={`Image ${i + 1}`}
                className="w-full h-full object-cover border border-border"
                onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
              />
              <div className="w-full h-full hidden items-center justify-center bg-muted border border-border">
                <ImageOff size={16} className="text-stone" />
              </div>
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 label-caps text-[0.5rem] bg-black/60 text-white px-1 py-0.5">Cover</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add URL input */}
      <div className="flex gap-2">
        <Input
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Paste image URL..."
          className="text-sm"
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }}
        />
        <button
          type="button"
          onClick={addImage}
          className="px-3 py-1.5 bg-charcoal text-white hover:bg-ink transition-colors flex items-center gap-1 label-caps text-xs flex-shrink-0"
        >
          <Plus size={13} /> Add
        </button>
      </div>
    </div>
  );
}