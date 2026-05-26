import React, { useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, GripVertical, ImageOff, Upload, ImageIcon } from "lucide-react";

export default function AdminHomeImages() {
  const queryClient = useQueryClient();
  const [newUrl, setNewUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [adding, setAdding] = useState(false);
  const [draggingOver, setDraggingOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [heroUrl, setHeroUrl] = useState("");
  const [heroUploading, setHeroUploading] = useState(false);

  const { data: images = [], isLoading } = useQuery({
    queryKey: ["site-images", "atmosphere"],
    queryFn: () => base44.entities.SiteImage.filter({ section: "atmosphere" }, "position", 20),
  });

  const { data: heroImages = [] } = useQuery({
    queryKey: ["site-images", "hero"],
    queryFn: () => base44.entities.SiteImage.filter({ section: "hero" }, "position", 1),
    onSuccess: (data) => { if (data[0]?.src) setHeroUrl(data[0].src); },
  });

  const heroImage = heroImages[0];

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.SiteImage.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["site-images", "atmosphere"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.SiteImage.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["site-images", "atmosphere"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SiteImage.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["site-images", "atmosphere"] }),
  });

  const updateHeroMutation = useMutation({
    mutationFn: async (src) => {
      if (heroImage) {
        await base44.entities.SiteImage.update(heroImage.id, { ...heroImage, src });
      } else {
        await base44.entities.SiteImage.create({ section: "hero", position: 0, src, caption: "" });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["site-images", "hero"] }),
  });

  const handleFileDrop = useCallback(async (files) => {
    const file = files[0];
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    createMutation.mutate({
      section: "atmosphere",
      position: images.length,
      src: file_url,
      caption: "",
    });
    setUploading(false);
  }, [images.length, createMutation]);

  const handleHeroFileDrop = useCallback(async (files) => {
    const file = files[0];
    if (!file || !file.type.startsWith("image/")) return;
    setHeroUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setHeroUrl(file_url);
    updateHeroMutation.mutate(file_url);
    setHeroUploading(false);
  }, [updateHeroMutation]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    createMutation.mutate({
      section: "atmosphere",
      position: images.length,
      src: newUrl.trim(),
      caption: newCaption.trim(),
    });
    setNewUrl("");
    setNewCaption("");
    setAdding(false);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(images);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    reordered.forEach((img, i) => {
      if (img.position !== i) updateMutation.mutate({ id: img.id, data: { ...img, position: i } });
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-light text-bone">Home Page Images</h1>
          <p className="text-sm text-stone mt-1">Manage hero and atmosphere section images.</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="label-caps px-5 py-2.5 bg-charcoal text-white hover:bg-ink transition-colors flex items-center gap-2"
        >
          <Plus size={14} /> Add Image
        </button>
      </div>

      {/* Hero Image Section */}
      <div className="mb-10">
        <h2 className="label-caps text-clay mb-4">Hero Image</h2>
        <div className="bg-surface-raised border border-warm p-5 space-y-4">
          <div
            className={`relative border-2 border-dashed transition-colors ${heroUploading ? "border-clay/50 bg-clay/5" : "border-bone/10 hover:border-clay/30"} rounded-sm`}
            onDragOver={(e) => { e.preventDefault(); }}
            onDrop={(e) => { e.preventDefault(); handleHeroFileDrop(e.dataTransfer.files); }}
          >
            {heroImage?.src ? (
              <div className="relative">
                <img src={heroImage.src} alt="Hero" className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-ink/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <p className="label-caps text-bone text-xs">Drop new image to replace</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-stone">
                {heroUploading ? (
                  <Loader2 size={24} className="animate-spin mb-2 text-clay" />
                ) : (
                  <>
                    <ImageIcon size={28} className="mb-3 opacity-40" />
                    <p className="text-sm">Drop an image here to set the hero background</p>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Label className="text-xs text-stone">Or paste image URL</Label>
              <Input
                value={heroUrl}
                onChange={(e) => setHeroUrl(e.target.value)}
                placeholder="https://..."
                className="mt-1 bg-transparent border-warm text-bone text-sm"
              />
            </div>
            <button
              onClick={() => updateHeroMutation.mutate(heroUrl)}
              disabled={updateHeroMutation.isPending || !heroUrl}
              className="label-caps px-5 py-2.5 bg-clay text-ink hover:bg-clay/80 transition-colors disabled:opacity-50"
            >
              {updateHeroMutation.isPending ? <Loader2 size={13} className="animate-spin" /> : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Atmosphere Images */}
      <h2 className="label-caps text-clay mb-4">Atmosphere Section</h2>
      <p className="text-xs text-stone mb-4">Drag to reorder. First 3 images are shown on the home page.</p>

      {/* Drop zone for new files */}
      <div
        className={`border-2 border-dashed rounded-sm mb-6 transition-colors ${draggingOver ? "border-clay bg-clay/5" : "border-bone/10"}`}
        onDragOver={(e) => { e.preventDefault(); setDraggingOver(true); }}
        onDragLeave={() => setDraggingOver(false)}
        onDrop={(e) => { e.preventDefault(); setDraggingOver(false); handleFileDrop(e.dataTransfer.files); }}
      >
        <div className="flex flex-col items-center justify-center py-8 text-stone">
          {uploading ? (
            <Loader2 size={20} className="animate-spin mb-2 text-clay" />
          ) : (
            <>
              <Upload size={20} className="mb-2 opacity-40" />
              <p className="text-sm">Drop image files here to upload and add</p>
              <p className="text-xs opacity-50 mt-1">or use the "Add Image" button above</p>
            </>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 size={22} className="animate-spin text-stone" />
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="images">
          {(provided) => (
            <div className="grid gap-4" ref={provided.innerRef} {...provided.droppableProps}>
              {images.map((img, i) => (
                <Draggable key={img.id} draggableId={img.id} index={i}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`bg-white border border-border p-4 flex items-start gap-4 transition-shadow ${snapshot.isDragging ? "shadow-lg" : ""}`}
                    >
                      <span {...provided.dragHandleProps} className="text-stone mt-1 cursor-grab active:cursor-grabbing">
                        <GripVertical size={16} />
                      </span>
                      <div className="w-28 h-20 flex-shrink-0 overflow-hidden border border-border bg-muted flex items-center justify-center">
                        {img.src ? (
                          <img src={img.src} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ImageOff size={16} className="text-stone" />
                        )}
                      </div>
                      <div className="flex-1 grid grid-cols-1 gap-2">
                        <div>
                          <Label className="text-xs">Image URL</Label>
                          <Input
                            defaultValue={img.src}
                            onBlur={(e) => {
                              if (e.target.value !== img.src)
                                updateMutation.mutate({ id: img.id, data: { ...img, src: e.target.value } });
                            }}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Caption</Label>
                          <Input
                            defaultValue={img.caption}
                            placeholder="e.g. Dusk over the old harbour, November."
                            onBlur={(e) => {
                              if (e.target.value !== img.caption)
                                updateMutation.mutate({ id: img.id, data: { ...img, caption: e.target.value } });
                            }}
                            className="text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3 flex-shrink-0">
                        <span className="label-caps text-[0.6rem] px-2 py-1 bg-muted text-stone">#{i + 1}</span>
                        <button
                          onClick={() => { if (confirm("Remove this image?")) deleteMutation.mutate(img.id); }}
                          className="text-stone hover:text-destructive transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {images.length === 0 && !isLoading && (
                <div className="text-center py-12 text-stone text-sm border border-dashed border-border">
                  No images yet. Drop files above or click "Add Image".
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {adding && (
        <form onSubmit={handleAdd} className="mt-6 bg-white border border-border p-5 grid gap-3">
          <h3 className="font-heading text-lg font-light text-charcoal">New Image (URL)</h3>
          <div>
            <Label className="text-xs">Image URL</Label>
            <Input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://..." required />
          </div>
          <div>
            <Label className="text-xs">Caption (optional)</Label>
            <Input value={newCaption} onChange={(e) => setNewCaption(e.target.value)} placeholder="e.g. Winter light, Reykjavík rooftops." />
          </div>
          {newUrl && (
            <img src={newUrl} alt="preview" className="w-full max-h-48 object-cover border border-border" onError={(e) => e.target.style.display = "none"} />
          )}
          <div className="flex gap-3">
            <button type="submit" disabled={createMutation.isPending} className="label-caps px-6 py-2.5 bg-charcoal text-white hover:bg-ink transition-colors flex items-center gap-2 disabled:opacity-50">
              {createMutation.isPending && <Loader2 size={13} className="animate-spin" />}
              Add Image
            </button>
            <button type="button" onClick={() => setAdding(false)} className="label-caps px-4 py-2.5 border border-border text-stone hover:text-charcoal transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}