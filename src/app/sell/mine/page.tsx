import { ListingCard } from "@/components/listing-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase, type Listing } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function MyListings({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const email = (await searchParams).email?.trim();
  let listings: Listing[] = [];
  let failed: string | null = null;
  if (email) {
    const { data, error } = await supabase.from("listings").select("*")
      .ilike("seller_email", email.replace(/[\\%_]/g, "\\$&")).order("created_at", { ascending: false });
    listings = (data ?? []) as Listing[];
    failed = error?.message ?? null;
  }
  return (
    <>
      <h2 className="text-3xl font-extrabold">Your listings</h2>
      <form className="mt-6 flex max-w-md gap-2">
        <Input name="email" type="email" required defaultValue={email} placeholder="Email you listed with" aria-label="Seller email" />
        <Button type="submit">Find</Button>
      </form>
      {failed && <p className="mt-6 text-destructive">Couldn’t load listings: {failed}</p>}
      {email && !failed && listings.length === 0 && <p className="mt-6 text-muted-foreground">No listings for that email.</p>}
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 xl:grid-cols-4">
        {listings.map((l) => <ListingCard key={l.id} l={l} />)}
      </div>
    </>
  );
}
