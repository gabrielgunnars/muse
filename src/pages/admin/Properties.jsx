import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import PropertyImageEditor from "@/components/admin/PropertyImageEditor";

const defaultProperty = {
  name: "", slug: "", description: "", short_description: "", images: [],
  max_guests: 2, bedrooms: 1, base_nightly_rate: 0, cleaning_fee: 0, tax_rate: 11,
  amenities: [], door_code: "", wifi_details: "", is_active: true, pay_on_arrival: false,
  address: "", lat: 64.147, lng: -21.935,
};

export default function Properties() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultProperty);
  const [imagesList, setImagesList] = useState([]);
  const [amenitiesText, setAmenitiesText] = useState("");
  const queryClient = useQueryClient();

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: () => base44.entities.Property.list(),
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        ...data,
        images: imagesList,
        amenities: amenitiesText.split(",").map(s => s.trim()).filter(Boolean),
      };
      if (editing) {
        await base44.entities.Property.update(editing.id, payload);
      } else {
        await base44.entities.Property.create(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      setDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Property.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-properties"] }),
  });

  const openNew = () => {
    setEditing(null);
    setForm(defaultProperty);
    setImagesList([]);
    setAmenitiesText("");
    setDialogOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm(p);
    setImagesList(p.images || []);
    setAmenitiesText((p.amenities || []).join(", "));
    setDialogOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-light text-bone">Properties</h1>
        <button onClick={openNew} className="label-caps px-5 py-2.5 bg-charcoal text-white hover:bg-ink transition-colors flex items-center gap-2">
          <Plus size={14} /> Add Property
        </button>
      </div>

      <div className="grid gap-4">
        {properties.map((p) => (
          <div key={p.id} className="bg-white border border-border p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {p.images?.[0] && <img src={p.images[0]} alt="" className="w-16 h-12 object-cover" />}
              <div>
                <p className="font-medium text-charcoal">{p.name}</p>
                <p className="text-xs text-stone">{p.bedrooms} bed · {p.max_guests} guests · €{p.base_nightly_rate}/night</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`label-caps text-xs px-2 py-1 ${p.is_active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {p.is_active ? "Active" : "Inactive"}
              </span>
              <button onClick={() => openEdit(p)} className="text-stone hover:text-charcoal"><Pencil size={16} /></button>
              <button onClick={() => { if (confirm("Delete this property?")) deleteMutation.mutate(p.id); }} className="text-stone hover:text-destructive"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-light">{editing ? "Edit" : "Add"} Property</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-xs">Name</Label><Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required /></div>
              <div><Label className="text-xs">Slug</Label><Input value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} required /></div>
            </div>
            <div><Label className="text-xs">Short Description</Label><Input value={form.short_description} onChange={(e) => setForm({...form, short_description: e.target.value})} /></div>
            <div><Label className="text-xs">Description</Label><Textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={4} /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label className="text-xs">Base Rate (€)</Label><Input type="number" value={form.base_nightly_rate} onChange={(e) => setForm({...form, base_nightly_rate: parseFloat(e.target.value)})} /></div>
              <div><Label className="text-xs">Cleaning Fee (€)</Label><Input type="number" value={form.cleaning_fee} onChange={(e) => setForm({...form, cleaning_fee: parseFloat(e.target.value)})} /></div>
              <div><Label className="text-xs">Tax Rate (%)</Label><Input type="number" value={form.tax_rate} onChange={(e) => setForm({...form, tax_rate: parseFloat(e.target.value)})} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-xs">Bedrooms</Label><Input type="number" value={form.bedrooms} onChange={(e) => setForm({...form, bedrooms: parseInt(e.target.value)})} /></div>
              <div><Label className="text-xs">Max Guests</Label><Input type="number" value={form.max_guests} onChange={(e) => setForm({...form, max_guests: parseInt(e.target.value)})} /></div>
            </div>
            <div><Label className="text-xs">Address</Label><Input value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-xs">Door Code</Label><Input value={form.door_code} onChange={(e) => setForm({...form, door_code: e.target.value})} /></div>
              <div><Label className="text-xs">WiFi Details</Label><Input value={form.wifi_details} onChange={(e) => setForm({...form, wifi_details: e.target.value})} /></div>
            </div>
            <PropertyImageEditor images={imagesList} onChange={setImagesList} />
            <div><Label className="text-xs">Amenities (comma-separated)</Label><Input value={amenitiesText} onChange={(e) => setAmenitiesText(e.target.value)} /></div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={(v) => setForm({...form, is_active: v})} /><Label className="text-xs">Active</Label></div>
              <div className="flex items-center gap-2"><Switch checked={form.pay_on_arrival} onCheckedChange={(v) => setForm({...form, pay_on_arrival: v})} /><Label className="text-xs">Pay on Arrival</Label></div>
            </div>
            <button type="submit" disabled={saveMutation.isPending} className="w-full label-caps py-3 bg-charcoal text-white hover:bg-ink transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {saveMutation.isPending && <Loader2 size={14} className="animate-spin" />}
              {editing ? "Save Changes" : "Create Property"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}