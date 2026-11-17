import { SellForm } from "@/components/sell-form";
import { CATEGORIES } from "@/lib/categories";

export default async function ItemPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const isVehicle = category === "Vehicles";
  const isHome = category === "Home Sales";
  return (
    <>
      <h2 className="text-3xl font-extrabold">{isVehicle ? "Vehicle for sale" : isHome ? "Home for sale or rent" : "Item for sale"}</h2>
      <div className="mt-6 max-w-xl rounded-3xl bg-white p-6">
        <SellForm defaultCategory={category && CATEGORIES.includes(category) ? category : undefined} />
      </div>
    </>
  );
}
