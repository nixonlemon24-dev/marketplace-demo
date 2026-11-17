"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/lib/categories";
import { cn, formatPrice } from "@/lib/utils";

type Fields = { title: string; description: string; price: string; category: string; email: string };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(f: Fields, file: File | null) {
  const e: Partial<Record<keyof Fields | "file", string>> = {};
  if (!f.title.trim()) e.title = "Add a title.";
  if (!(Number(f.price) > 0)) e.price = "Enter a price above 0.";
  if (!f.category) e.category = "Choose a category.";
  if (!EMAIL.test(f.email.trim())) e.email = "Enter a valid email.";
  if (file && !/^image\/(jpeg|png|webp|gif)$/.test(file.type)) e.file = "Use a JPG, PNG, WebP or GIF image.";
  else if (file && file.size > 5 * 1024 * 1024) e.file = "The image must be under 5 MB.";
  return e;
}

function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">{label}</label>
      {children}
      {error && <p role="alert" className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function ListingForm() {
  const router = useRouter();
  const initial = useSearchParams().get("category");
  const [f, setF] = useState<Fields>({ title: "", description: "", price: "", email: "", category: initial && CATEGORIES.includes(initial) ? initial : "" });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const errors = validate(f, file);
  const err = (k: keyof typeof errors) => (submitted ? errors[k] : undefined);
  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));
  const setPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [a, ...rest] = e.target.value.replace(/[^0-9.]/g, "").split(".");
    setF((p) => ({ ...p, price: rest.length ? `${a}.${rest.join("").slice(0, 2)}` : a }));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length) return;
    setBusy(true);
    setError(null);
    try {
      let image_url: string | null = null;
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const r = await fetch("/api/upload", { method: "POST", body: fd });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error);
        image_url = j.url;
      }
      const r = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: f.title.trim(), description: f.description.trim(), price: Number(f.price), category: f.category, seller_email: f.email.trim(), image_url }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      router.push(`/item/${j.listing.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <form onSubmit={submit} noValidate className="space-y-4 rounded-2xl bg-card p-4 sm:p-6">
        <Field label="Photo" id="photo" error={err("file")}>
          <div onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); setFile(e.dataTransfer.files?.[0] ?? null); }}
            className={cn("relative grid min-h-40 place-items-center rounded-xl border-2 border-dashed p-4 text-center", drag ? "border-primary bg-primary/5" : "border-input")}>
            {preview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Selected photo" className="max-h-52 rounded-lg object-contain" />
                <Button type="button" size="icon" variant="secondary" aria-label="Remove photo" className="absolute right-2 top-2 size-8" onClick={() => setFile(null)}><X className="size-4" /></Button>
              </>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()} className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                <ImagePlus className="size-8" />
                <span><span className="font-semibold text-primary">Add a photo</span> or drag and drop it here</span>
                <span className="text-xs">JPG, PNG, WebP or GIF, up to 5 MB</span>
              </button>
            )}
            <input ref={fileRef} id="photo" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>
        </Field>
        <Field label="Title" id="title" error={err("title")}><Input id="title" value={f.title} onChange={set("title")} maxLength={255} /></Field>
        <Field label="Description" id="description"><Textarea id="description" value={f.description} onChange={set("description")} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Price (USD)" id="price" error={err("price")}><Input id="price" inputMode="decimal" placeholder="0.00" value={f.price} onChange={setPrice} /></Field>
          <Field label="Category" id="category" error={err("category")}>
            <Select id="category" value={f.category} onChange={set("category")}>
              <option value="" disabled>Choose one</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Your email" id="email" error={err("email")}><Input id="email" type="email" value={f.email} onChange={set("email")} /></Field>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" size="lg" disabled={busy}>{busy && <Loader2 className="size-4 animate-spin" />}{busy ? "Publishing…" : "Publish listing"}</Button>
      </form>

      <aside aria-label="Listing preview" className="lg:sticky lg:top-20 lg:self-start">
        <p className="mb-2 text-sm font-semibold text-muted-foreground">Preview</p>
        <Card>
          <div className="aspect-[4/3] overflow-hidden rounded-t-2xl bg-black/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {preview && <img src={preview} alt="" className="size-full object-cover" />}
          </div>
          <CardHeader>
            <CardTitle>{f.price ? formatPrice(f.price) : "$0"}</CardTitle>
            <p className="truncate text-sm">{f.title || "Your title"}</p>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Palo Alto, CA{f.category && ` · ${f.category}`}</CardContent>
        </Card>
      </aside>
    </div>
  );
}
