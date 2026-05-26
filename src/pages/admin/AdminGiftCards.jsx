import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Gift, Ban } from "lucide-react";

export default function AdminGiftCards() {
  const queryClient = useQueryClient();

  const { data: giftCards = [] } = useQuery({
    queryKey: ["admin-gift-cards"],
    queryFn: () => base44.entities.GiftCard.list("-created_date"),
  });

  const voidMutation = useMutation({
    mutationFn: (id) => base44.entities.GiftCard.update(id, { is_void: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-gift-cards"] }),
  });

  return (
    <div>
      <h1 className="font-heading text-3xl font-light text-bone mb-8">Gift Cards</h1>

      <div className="bg-white border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-warm-dark">
              <th className="text-left p-4 label-caps text-white text-xs font-normal">Code</th>
              <th className="text-left p-4 label-caps text-white text-xs font-normal">Amount</th>
              <th className="text-left p-4 label-caps text-white text-xs font-normal">Recipient</th>
              <th className="text-left p-4 label-caps text-white text-xs font-normal">Redeemed</th>
              <th className="text-left p-4 label-caps text-white text-xs font-normal">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {giftCards.map((gc) => (
              <tr key={gc.id} className="border-b border-border last:border-0">
                <td className="p-4 font-mono text-charcoal">{gc.code}</td>
                <td className="p-4 text-charcoal">€{gc.amount}</td>
                <td className="p-4">
                  <p className="text-charcoal">{gc.recipient_name}</p>
                  <p className="text-xs text-stone">{gc.recipient_email}</p>
                </td>
                <td className="p-4 text-stone">€{gc.redeemed_amount || 0}</td>
                <td className="p-4">
                  <span className={`label-caps text-xs px-2 py-1 ${gc.is_void ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
                    {gc.is_void ? "Voided" : "Active"}
                  </span>
                </td>
                <td className="p-4">
                  {!gc.is_void && (
                    <button onClick={() => { if (confirm("Void this gift card?")) voidMutation.mutate(gc.id); }}
                      className="text-stone hover:text-destructive"><Ban size={14} /></button>
                  )}
                </td>
              </tr>
            ))}
            {giftCards.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-stone">No gift cards issued yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}