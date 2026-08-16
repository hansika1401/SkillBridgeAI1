"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/firebase";
import { CheckCircle2, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

export function PlacementCourse() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });
  const [error, setError] = useState<string | null>(null);

  async function onCheckout() {
    if (!user || user.isAnonymous) {
      router.replace("/auth");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          courseId: "placement_100",
          amount: 4999,
          card,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Payment failed");
      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        router.refresh();
      }, 1500);
    } catch (e: any) {
      setError(e?.message || "Payment failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="container mx-auto px-4 md:px-6 py-10">
      <Card className="glass-card border-primary/20">
        <CardHeader className="flex items-center justify-between gap-4 md:flex-row md:items-center">
          <div>
            <CardTitle className="font-headline text-2xl">100% Placement Course</CardTitle>
            <p className="text-sm text-muted-foreground">Job-ready training with mentor guidance and guaranteed placement support.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold">₹4,999</div>
            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Button onClick={() => {
                if (isUserLoading) return;
                if (!user || user.isAnonymous) { router.replace("/auth"); return; }
                setOpen(true);
              }}>Buy Now</Button>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-background p-6 shadow-2xl">
                  <Dialog.Title className="mb-4 flex items-center gap-2 text-lg font-medium">
                    <CreditCard className="h-5 w-5"/> Payment Details
                  </Dialog.Title>
                  {success ? (
                    <div className="flex flex-col items-center justify-center py-10">
                      <CheckCircle2 className="h-14 w-14 text-green-500" />
                      <div className="mt-2 text-lg font-semibold">Payment Successful</div>
                    </div>
                  ) : (
                    <form
                      className="space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!submitting) onCheckout();
                      }}
                    >
                      <Input
                        placeholder="Card Number"
                        value={card.number}
                        onChange={e => setCard(v => ({ ...v, number: e.target.value }))}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="MM/YY"
                          value={card.expiry}
                          onChange={e => setCard(v => ({ ...v, expiry: e.target.value }))}
                        />
                        <Input
                          placeholder="CVV"
                          value={card.cvv}
                          onChange={e => setCard(v => ({ ...v, cvv: e.target.value }))}
                        />
                      </div>
                      {error && (
                        <div className="text-sm text-red-500">{error}</div>
                      )}
                      <div className="flex justify-end gap-2 pt-2">
                        <Dialog.Close asChild>
                          <Button variant="ghost" type="button">Cancel</Button>
                        </Dialog.Close>
                        <Button type="submit" disabled={submitting}>{submitting ? "Processing..." : "Pay ₹4,999"}</Button>
                      </div>
                    </form>
                  )}
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Includes live mentor sessions, real projects, resume reviews, and interview prep.
        </CardContent>
      </Card>
    </section>
  );
}
