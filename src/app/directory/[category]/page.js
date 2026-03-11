import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";
import { getListings } from "@/lib/api";
import { getViewer } from "@/lib/auth";
import CcrCardGrid from "@/components/directory/CcrCardGrid";

export async function generateMetadata({ params }) {
  const { category } = await params;
  const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
  
  return {
    title: `${capitalizedCategory} in Cape Coral - Cape Coral Reviewed`,
    description: `Browse the best ${category} businesses in Cape Coral, Florida. Read reviews and find contact information.`,
  };
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const listings = await getListings(category);
  const currentUser = await getViewer();

  // Derive category name from the first listing if available, or use the slug
  const categoryName = listings[0]?.ccrdirectorytypes?.nodes.find(n => n.slug === category)?.name || category;

  return (
    <main style={{ padding: "3rem", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <header style={{ marginBottom: "3rem" }}>
        <Link href="/" style={{ color: "#0070f3", textDecoration: "none", fontSize: "0.9rem" }}>← Back to Directory</Link>
        <h1 style={{ fontSize: "2.5rem", marginTop: "1rem", textTransform: "capitalize" }}>
          Best {categoryName} in Cape Coral
        </h1>
        <p style={{ color: "#666" }}>Showing {listings.length} local businesses</p>
      </header>

      {listings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", border: "1px dashed #ccc", borderRadius: "12px" }}>
          <p>No listings found in this category yet.</p>
        </div>
      ) : (
        <CcrCardGrid listings={listings} currentUser={currentUser} />
      )}
    </main>
  );
}
