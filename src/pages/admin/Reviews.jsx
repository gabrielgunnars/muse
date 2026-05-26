import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Check, X } from "lucide-react";

export default function Reviews() {
  const queryClient = useQueryClient();

  const { data: reviews = [] } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: () => base44.entities.Review.list("-created_date"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Review.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-reviews"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Review.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-reviews"] }),
  });

  const pending = reviews.filter((r) => !r.approved);
  const approved = reviews.filter((r) => r.approved);

  return (
    <div>
      <h1 className="font-heading text-3xl font-light text-bone mb-8">Reviews</h1>

      {pending.length > 0 && (
        <div className="mb-12">
          <h2 className="label-caps text-charcoal mb-4">Pending Approval ({pending.length})</h2>
          <div className="space-y-4">
            {pending.map((r) => (
              <div key={r.id} className="bg-yellow-50 border border-yellow-200 p-5 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={12} className={j < r.rating ? "text-clay fill-clay" : "text-border"} />
                    ))}
                    <span className="text-sm text-stone ml-2">— {r.guest_name}</span>
                  </div>
                  <p className="text-sm text-charcoal">{r.body}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateMutation.mutate({ id: r.id, data: { approved: true } })}
                    className="p-2 bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                    <Check size={16} />
                  </button>
                  <button onClick={() => deleteMutation.mutate(r.id)}
                    className="p-2 bg-red-100 text-red-700 hover:bg-red-200 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="label-caps text-charcoal mb-4">Published ({approved.length})</h2>
      <div className="space-y-3">
        {approved.map((r) => (
          <div key={r.id} className="bg-white border border-border p-5">
            <div className="flex items-center gap-2 mb-2">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} size={12} className={j < r.rating ? "text-clay fill-clay" : "text-border"} />
              ))}
              <span className="text-sm text-stone ml-2">— {r.guest_name}</span>
            </div>
            <p className="text-sm text-charcoal">{r.body}</p>
          </div>
        ))}
        {approved.length === 0 && <p className="text-stone py-8 text-center">No published reviews yet.</p>}
      </div>
    </div>
  );
}