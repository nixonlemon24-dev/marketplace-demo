import { Shell } from "@/components/layout/shell";
import { ItemDetail } from "@/components/marketplace/item-detail";

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Shell><ItemDetail id={id} /></Shell>;
}
