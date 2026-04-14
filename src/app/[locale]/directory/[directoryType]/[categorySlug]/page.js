import Link from "next/link";
import { getListingsByCategory } from "@/lib/api";
import { getViewer } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";
import DirectoryFilterManager from "@/components/directory/DirectoryFilterManager";

export async function generateMetadata({ params }) {
  const { directoryType, categorySlug } = await params;
  const capitalizedType = directoryType.charAt(0).toUpperCase() + directoryType.slice(1).replace(/-/g, ' ');
  const capitalizedCategory = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace(/-/g, ' ');
  
  return {
    title: `${capitalizedCategory} in ${capitalizedType} - Cape Coral Reviewed`,
    description: `Browse the best ${capitalizedCategory} in ${capitalizedType} in Cape Coral, Florida. Read reviews and find contact information.`,
  };
}

export default async function CategoryPage({ params }) {
  const { locale, directoryType, categorySlug } = await params;
  const dict = await getDictionary(locale);
  const listings = await getListingsByCategory(categorySlug, directoryType);
  const currentUser = await getViewer();

  const t = dict?.directory || {};

  // Derive category name from the first listing if available, or use the slug
  const categoryName = listings[0]?.ccrlistingcategories?.nodes?.find(n => n.slug === categorySlug)?.name || categorySlug.replace(/-/g, ' ');

  return (
    <main style={{ padding: "3rem", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <header style={{ marginBottom: "3rem" }}>
        <Link href={`/${locale}/directory/${directoryType}`} style={{ color: "#0070f3", textDecoration: "none", fontSize: "0.9rem" }}>← Back to {directoryType.replace(/-/g, ' ')}</Link>
        <h1 style={{ fontSize: "2.5rem", marginTop: "1rem", textTransform: "capitalize" }}>
          Best {categoryName} in Cape Coral
        </h1>
        <p style={{ color: "#666" }}>
          {listings.length} {t.listingsFound || "listings found"}
        </p>
      </header>

      {listings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", border: "1px dashed #ccc", borderRadius: "12px" }}>
          <p>{t.noListingsFound || "No listings found in this category yet."}</p>
        </div>
      ) : (
        <DirectoryFilterManager listings={listings} currentUser={currentUser} dict={dict} locale={locale} />
      )}
    </main>
  );
}
