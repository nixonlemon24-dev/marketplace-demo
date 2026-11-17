import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ListingForm } from "@/components/marketplace/listing-form";

export default function CreateItemPage() {
  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-8">
      <Link href="/create" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft className="size-4" />Listing types
      </Link>
      <h1 className="mb-6 text-3xl font-extrabold">Item for sale</h1>
      <Suspense><ListingForm /></Suspense>
    </main>
  );
}
