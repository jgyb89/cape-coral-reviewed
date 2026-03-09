import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";
import { getListings } from "@/lib/api";

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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "2.5rem",
          }}
        >
          {listings.map((listing) => {
            // Calculate rating
            const reviewNodes = listing.ccrreviews?.nodes || [];
            const reviewCount = reviewNodes.length;
            const averageRating = reviewCount > 0 
              ? (reviewNodes.reduce((acc, curr) => acc + (curr.starRating || 0), 0) / reviewCount).toFixed(1)
              : null;

            const cleanContent = DOMPurify.sanitize(listing.content || "", {
              ALLOWED_TAGS: ["p"],
              ALLOWED_ATTR: [],
            }).substring(0, 120) + "...";

            return (
              <div
                key={listing.slug}
                style={{
                  border: "1px solid #eaeaea",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "transform 0.2s ease",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                {listing.featuredImage?.node?.sourceUrl && (
                  <div style={{ height: "200px", position: "relative" }}>
                    <img 
                      src={listing.featuredImage.node.sourceUrl} 
                      alt={listing.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                )}
                
                <div style={{ padding: "1.5rem", flex: "1" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <h2 style={{ fontSize: "1.4rem", margin: 0 }}>
                      {listing.title}
                    </h2>
                    {averageRating && (
                      <span style={{ fontSize: "0.9rem", color: "#f39c12", fontWeight: "bold" }}>
                        ★ {averageRating}
                      </span>
                    )}
                  </div>

                  <div 
                    style={{ color: "#555", fontSize: "0.95rem", marginBottom: "1.5rem", lineHeight: "1.5" }}
                    dangerouslySetInnerHTML={{ __html: cleanContent }}
                  />
                  <p style={{ fontSize: "0.9rem", color: "#888", marginBottom: "1.5rem" }}>
                    📍 {listing.addressStreet}, {listing.addressCity}
                  </p>
                  
                  <Link 
                    href={`/directory/${category}/${listing.slug}`}
                    style={{ 
                      display: "block", 
                      textAlign: "center", 
                      padding: "0.8rem", 
                      backgroundColor: "#000", 
                      color: "#fff", 
                      textDecoration: "none", 
                      borderRadius: "8px",
                      fontWeight: "600"
                    }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
