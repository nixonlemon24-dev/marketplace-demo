import { Suspense } from "react";
import { Shell } from "@/components/layout/shell";
import { ItemGrid } from "@/components/marketplace/item-grid";

export default function Home() {
  return <Shell><Suspense><ItemGrid /></Suspense></Shell>;
}
