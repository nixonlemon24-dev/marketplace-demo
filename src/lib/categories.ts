export const CATEGORIES = [
  "Vehicles", "Property Rentals", "Apparel", "Classifieds", "Electronics", "Entertainment",
  "Family", "Free Stuff", "Garden & Outdoor", "Hobbies", "Home Goods", "Home Improvement",
  "Home Sales", "Musical Instruments", "Office Supplies", "Pet Supplies", "Sporting Goods",
  "Toys & Games", "Buy and sell groups",
];
export const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const CATEGORY_LIST = CATEGORIES.map((name) => ({ name, slug: slugify(name) }));
export const categoryFromSlug = (slug: string) => CATEGORY_LIST.find((c) => c.slug === slug);
