import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

const categories = ["coffee", "restaurant", "bar", "bookshop", "gallery", "nature", "shop"];

const defaultVenue = { name: "", category: "coffee", area: "", description: "", url: "", lat: 0, lng: 0, is_active: true };

export default function ConciergeSettings() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultVenue);
  const queryClient = useQueryClient();

  const { data: venues = [] } = useQuery({
    queryKey: ["admin-venues"],
    queryFn: () => base44.entities.ConciergeVenue.list(),
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editing) {
        await base44.entities.ConciergeVenue.update(editing.id, data);
      } else {
        await base44.entities.ConciergeVenue.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-venues"] });
      setDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ConciergeVenue.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-venues"] }),
  });

  const openNew = () => { setEditing(null); setForm(defaultVenue); setDialogOpen(true); };
  const openEdit = (v) => { setEditing(v); setForm(v); setDialogOpen(true); };

  const grouped = {};
  venues.forEach((v) => { if (!grouped[v.category]) grouped[v.category] = []; grouped[v.category].push(v); });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-light text-bone">Concierge Venues</h1>
        <button onClick={openNew} className="label-caps px-5 py-2.5 bg-charcoal text-white hover:bg-ink transition-colors flex items-center gap-2">
          <Plus size={14} /> Add Venue
        </button>
      </div>

      {categories.map((cat) => {
        const catVenues = grouped[cat];
        if (!catVenues?.length) return null;
        return (
          <div key={cat} className="mb-8">
            <h2 className="label-caps text-clay mb-3 capitalize">{cat}</h2>
            <div className="space-y-2">
              {catVenues.map((v) => (
                <div key={v.id} className="bg-white border border-border p-4 flex items-center justify-between">
                  <div>
                    <p className="text-charcoal font-medium">{v.name} {!v.is_active && <span className="text-xs text-stone">(inactive)</span>}</p>
                    <p className="text-xs text-stone">{v.area} — {v.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(v)} className="text-stone hover:text-charcoal"><Pencil size={14} /></button>
                    <button onClick={() => { if (confirm("Delete?")) deleteMutation.mutate(v.id); }} className="text-stone hover:text-destructive"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-light">{editing ? "Edit" : "Add"} Venue</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }} className="space-y-4">
            <div><Label className="text-xs">Name</Label><Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required /></div>
            <div><Label className="text-xs">Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({...form, category: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{categories.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Area</Label><Input value={form.area} onChange={(e) => setForm({...form, area: e.target.value})} /></div>
            <div><Label className="text-xs">Description</Label><Input value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} /></div>
            <div><Label className="text-xs">URL</Label><Input value={form.url} onChange={(e) => setForm({...form, url: e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-xs">Latitude</Label><Input type="number" step="any" value={form.lat} onChange={(e) => setForm({...form, lat: parseFloat(e.target.value)})} /></div>
              <div><Label className="text-xs">Longitude</Label><Input type="number" step="any" value={form.lng} onChange={(e) => setForm({...form, lng: parseFloat(e.target.value)})} /></div>
            </div>
            <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={(v) => setForm({...form, is_active: v})} /><Label className="text-xs">Active</Label></div>
            <button type="submit" disabled={saveMutation.isPending} className="w-full label-caps py-3 bg-charcoal text-white hover:bg-ink transition-colors disabled:opacity-50">
              {editing ? "Save" : "Create"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}