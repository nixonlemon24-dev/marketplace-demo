"use client";
import { useActionState } from "react";
import { createListing } from "@/app/actions";
import { CATEGORIES } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const label = "mb-1 block text-sm font-semibold";

export function SellForm({ defaultCategory }: { defaultCategory?: string }) {
  const [state, action, pending] = useActionState(createListing, undefined);
  return (
    <form action={action} className="space-y-4">
      <div><label className={label} htmlFor="image">Photo</label>
        <Input id="image" name="image" type="file" accept="image/*" className="h-auto py-2" /></div>
      <div><label className={label} htmlFor="title">Title</label><Input id="title" name="title" required maxLength={255} /></div>
      <div><label className={label} htmlFor="description">Description</label><Textarea id="description" name="description" /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={label} htmlFor="price">Price (USD)</label>
          <Input id="price" name="price" type="number" min="0" step="0.01" required /></div>
        <div><label className={label} htmlFor="category">Category</label>
          <select id="category" name="category" required defaultValue={defaultCategory ?? ""}
            className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring">
            <option value="" disabled>Choose one</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select></div>
      </div>
      <div><label className={label} htmlFor="email">Your email</label><Input id="email" name="email" type="email" required /></div>
      {state?.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" size="lg" disabled={pending}>{pending ? "Publishing…" : "Publish listing"}</Button>
    </form>
  );
}
