"use client";
import { useActionState } from "react";
import { sendMessage } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function MessageForm({ listingId }: { listingId: string }) {
  const [state, action, pending] = useActionState(sendMessage, undefined);
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="listing_id" value={listingId} />
      <Input name="buyer_email" type="email" required placeholder="Your email" aria-label="Your email" />
      <Textarea name="message" required placeholder="Hi, is this still available?" aria-label="Message" />
      {state?.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}
      {state?.ok && <p role="status" className="text-sm font-semibold text-primary">Message sent. The seller will reply to your email.</p>}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>{pending ? "Sending…" : "Message seller"}</Button>
    </form>
  );
}
