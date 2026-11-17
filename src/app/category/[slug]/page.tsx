import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Shell } from "@/components/layout/shell";
import { ItemGrid } from "@/components/marketplace/item-grid";
import { categoryFromSlug } from "@/lib/categories";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categoryFromSlug(slug);
  if (!category) notFound();
  return <Shell><Suspense><ItemGrid category={category.name} title={category.name} /></Suspense></Shell>;
}
