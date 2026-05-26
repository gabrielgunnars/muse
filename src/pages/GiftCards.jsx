import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Gift, CheckCircle, Loader2 } from "lucide-react";
import FadeInSection from "../components/shared/FadeInSection";
import SectionLabel from "../components/shared/SectionLabel";

const amounts = [100, 200, 350, 500];

export default function GiftCards() {
  const [step, setStep] = useState("form");
  const [amount, setAmount] = useState(200);
  const [customAmount, setCustomAmount] = useState("");
  const [form, setForm] = useState({ recipient_name: "", recipient_email: "", message: "" });

  const generateCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "MUSE-";
    for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
  };

  const createGiftCard = useMutation({
    mutationFn: async () => {
      const code = generateCode();
      const finalAmount = customAmount ? parseInt(customAmount) : amount;
      await base44.entities.GiftCard.create({
        code,
        amount: finalAmount,
        recipient_name: form.recipient_name,
        recipient_email: form.recipient_email,
        message: form.message,
        redeemed_amount: 0,
        is_void: false,
      });
      await base44.integrations.Core.SendEmail({
        to: form.recipient_email,
        subject: "You've received a MUSE Reykjavík gift card",
        body: `Dear ${form.recipient_name},\n\nYou've been given a MUSE Reykjavík gift card worth €${finalAmount}.\n\n${form.message ? `"${form.message}"\n\n` : ""}Your gift card code: ${code}\n\nUse this code when booking your stay at musereykjavik.com.\n\nWarm regards,\nMUSE Reykjavík`,
        from_name: "MUSE Reykjavík",
      });
      setStep("success");
    },
  });

  const finalAmount = customAmount ? parseInt(customAmount) : amount;

  if (step === "success") {
    return (
      <div className="pt-20 min-h-screen bg-bone flex items-center justify-center px-6">
        <FadeInSection className="text-center max-w-md">
          <CheckCircle size={48} className="text-clay mx-auto mb-6" strokeWidth={1} />
          <h1 className="font-heading text-4xl text-charcoal mb-4">Gift Card Sent</h1>
          <p className="text-stone leading-relaxed mb-8">
            A gift card worth €{finalAmount} has been sent to {form.recipient_email}.
          </p>
          <button onClick={() => { setStep("form"); setForm({ recipient_name: "", recipient_email: "", message: "" }); }}
            className="label-caps px-8 py-3 border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-all">
            Send Another
          </button>
        </FadeInSection>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-bone">
      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-20">
        <FadeInSection className="text-center mb-16">
          <Gift size={40} className="text-clay mx-auto mb-4" strokeWidth={1} />
          <SectionLabel className="text-center">Gift</SectionLabel>
          <h1 className="font-heading text-5xl lg:text-6xl font-light text-charcoal mb-4">
            MUSE Gift Card
          </h1>
          <p className="text-stone max-w-md mx-auto">
            Give someone a stay with a point of view. Redeemable across all MUSE apartments.
          </p>
        </FadeInSection>

        <FadeInSection delay={0.2}>
          <div className="bg-cream p-8">
            <h2 className="label-caps text-charcoal mb-6">Select Amount</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {amounts.map((a) => (
                <button key={a} onClick={() => { setAmount(a); setCustomAmount(""); }}
                  className={`py-3 border text-sm transition-all ${amount === a && !customAmount ? "border-charcoal bg-charcoal text-white" : "border-border text-stone hover:border-charcoal"}`}>
                  €{a}
                </button>
              ))}
            </div>
            <Input
              placeholder="Or enter a custom amount (€)"
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="border-0 border-b border-border rounded-none bg-transparent focus-visible:ring-0 px-0"
            />

            <div className="mt-8 space-y-5">
              <h2 className="label-caps text-charcoal">Recipient Details</h2>
              <div>
                <Label className="label-caps text-stone text-xs">Recipient Name</Label>
                <Input required value={form.recipient_name} onChange={(e) => setForm({...form, recipient_name: e.target.value})}
                  className="border-0 border-b border-border rounded-none bg-transparent focus-visible:ring-0 px-0" />
              </div>
              <div>
                <Label className="label-caps text-stone text-xs">Recipient Email</Label>
                <Input required type="email" value={form.recipient_email} onChange={(e) => setForm({...form, recipient_email: e.target.value})}
                  className="border-0 border-b border-border rounded-none bg-transparent focus-visible:ring-0 px-0" />
              </div>
              <div>
                <Label className="label-caps text-stone text-xs">Personal Message (Optional)</Label>
                <Textarea value={form.message} onChange={(e) => setForm({...form, message: e.target.value})}
                  className="border-0 border-b border-border rounded-none bg-transparent focus-visible:ring-0 px-0 resize-none" rows={3} />
              </div>
            </div>

            <button
              onClick={() => createGiftCard.mutate()}
              disabled={!form.recipient_name || !form.recipient_email || (!amount && !customAmount) || createGiftCard.isPending}
              className="w-full label-caps py-4 mt-8 bg-charcoal text-white hover:bg-ink transition-colors disabled:opacity-30 flex items-center justify-center gap-2"
            >
              {createGiftCard.isPending && <Loader2 size={16} className="animate-spin" />}
              Purchase Gift Card — €{finalAmount || 0}
            </button>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}