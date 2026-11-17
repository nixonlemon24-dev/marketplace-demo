import Link from "next/link";

export default function NotFound() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-extrabold">Page not found</h1>
      <Link href="/" className="mt-2 inline-block text-primary hover:underline">Back to Marketplace</Link>
    </main>
  );
}
