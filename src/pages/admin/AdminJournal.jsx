import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const CATEGORIES = [
  { value: "reykjavik-atmosphere", label: "Reykjavík Atmosphere" },
  { value: "winter-living", label: "Winter Living" },
  { value: "architecture-light", label: "Architecture & Light" },
  { value: "icelandic-rituals", label: "Icelandic Rituals" },
  { value: "slow-travel", label: "Slow Travel" },
  { value: "seasonal-guides", label: "Seasonal Guides" },
  { value: "design-interiors", label: "Design & Interiors" },
];

const EMPTY = {
  title: "", slug: "", category: "", hero_image: "",
  excerpt: "", body: "", author: "MUSE",
  published_at: "", is_published: false,
};

export default function AdminJournal() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const { data: articles = [] } = useQuery({
    queryKey: ["admin-journal"],
    queryFn: () => base44.entities.JournalArticle.list("-published_at"),
  });

  const saveMutation = useMutation({
    mutationFn: (data) =>
      editing?.id
        ? base44.entities.JournalArticle.update(editing.id, data)
        : base44.entities.JournalArticle.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-journal"] }); setEditing(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.JournalArticle.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-journal"] }),
  });

  const openNew = () => { setForm(EMPTY); setEditing({}); };
  const openEdit = (a) => { setForm({ ...a }); setEditing(a); };

  const autoSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-light text-bone">Journal</h1>
          <p className="text-stone text-sm mt-1">Write and publish editorial articles</p>
        </div>
        <Button onClick={openNew} className="bg-clay hover:bg-clay/80 text-ink label-caps">
          <Plus size={15} className="mr-2" /> New article
        </Button>
      </div>

      {/* Editor panel */}
      {editing !== null && (
        <div className="bg-surface-raised border border-warm rounded-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-bone font-heading text-xl font-light">{editing?.id ? "Edit Article" : "New Article"}</h2>
            <button onClick={() => setEditing(null)} className="text-stone hover:text-bone"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-stone text-xs mb-1.5 block">Title</Label>
              <Input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: autoSlug(e.target.value) }))}
                className="bg-transparent border-warm text-bone"
                placeholder="Article title"
              />
            </div>
            <div>
              <Label className="text-stone text-xs mb-1.5 block">Slug</Label>
              <Input
                value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                className="bg-transparent border-warm text-bone"
                placeholder="url-slug"
              />
            </div>
            <div>
              <Label className="text-stone text-xs mb-1.5 block">Category</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger className="bg-transparent border-warm text-bone">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-[#1E1A16] border-warm text-bone">
                  {CATEGORIES.map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-stone text-xs mb-1.5 block">Hero Image URL</Label>
              <Input
                value={form.hero_image}
                onChange={e => setForm(f => ({ ...f, hero_image: e.target.value }))}
                className="bg-transparent border-warm text-bone"
                placeholder="https://..."
              />
            </div>
            <div>
              <Label className="text-stone text-xs mb-1.5 block">Author</Label>
              <Input
                value={form.author}
                onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                className="bg-transparent border-warm text-bone"
              />
            </div>
            <div>
              <Label className="text-stone text-xs mb-1.5 block">Publish Date</Label>
              <Input
                type="date"
                value={form.published_at}
                onChange={e => setForm(f => ({ ...f, published_at: e.target.value }))}
                className="bg-transparent border-warm text-bone"
              />
            </div>
          </div>
          <div className="mb-4">
            <Label className="text-stone text-xs mb-1.5 block">Excerpt</Label>
            <Textarea
              value={form.excerpt}
              onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
              className="bg-transparent border-warm text-bone h-20"
              placeholder="Short teaser for article cards..."
            />
          </div>
          <div className="mb-6">
            <Label className="text-stone text-xs mb-1.5 block">Body (Markdown)</Label>
            <Textarea
              value={form.body}
              onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
              className="bg-transparent border-warm text-bone h-48 font-mono text-sm"
              placeholder="Write your article in Markdown..."
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Switch
                checked={form.is_published}
                onCheckedChange={v => setForm(f => ({ ...f, is_published: v }))}
              />
              <Label className="text-stone text-sm">{form.is_published ? "Published" : "Draft"}</Label>
            </div>
            <Button
              onClick={() => saveMutation.mutate(form)}
              disabled={saveMutation.isPending || !form.title || !form.slug}
              className="bg-clay hover:bg-clay/80 text-ink label-caps"
            >
              {saveMutation.isPending ? "Saving..." : "Save article"}
            </Button>
          </div>
        </div>
      )}

      {/* Articles list */}
      <div className="space-y-2">
        {articles.map(a => (
          <div key={a.id} className="flex items-center justify-between bg-surface border border-warm p-4 rounded-sm">
            <div className="flex items-center gap-4 min-w-0">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${a.is_published ? "bg-clay" : "bg-stone/40"}`} />
              <div className="min-w-0">
                <p className="text-bone text-sm truncate">{a.title}</p>
                <p className="label-caps text-stone/50 mt-0.5" style={{ fontSize: '0.58rem' }}>
                  {CATEGORIES.find(c => c.value === a.category)?.label || a.category} · {a.is_published ? "Published" : "Draft"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
              <Button variant="ghost" size="icon" onClick={() => openEdit(a)} className="text-stone hover:text-bone h-8 w-8">
                <Pencil size={14} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(a.id)} className="text-stone hover:text-destructive h-8 w-8">
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
        {articles.length === 0 && (
          <div className="text-center py-16 text-stone text-sm">
            No articles yet. Write your first.
          </div>
        )}
      </div>
    </div>
  );
}