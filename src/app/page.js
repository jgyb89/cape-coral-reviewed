import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";
import { getListings } from "@/lib/api";

export default async function DirectoryPage() {
  const listings = await getListings();

  return (
    <main
      style={{
        padding: "3rem",
        fontFamily: "sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <header style={{ marginBottom: "3rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "800", marginBottom: "1rem" }}>
          Cape Coral Reviewed
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#666" }}>
          Discover the best local businesses in Cape Coral, Florida.
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "2rem",
        }}
      >
        {listings.map((listing) => {
          const category = listing.ccrdirectorytypes?.nodes[0];
          const categorySlug = category?.slug || "uncategorized";
          
          // Calculate rating from edges
          const reviewNodes = listing.reviews?.map(edge => edge.node) || [];
          const reviewCount = reviewNodes.length;
          const averageRating = reviewCount > 0 
            ? (reviewNodes.reduce((acc, curr) => acc + (curr.starRating || 0), 0) / reviewCount).toFixed(1)
            : null;

          const cleanContent = DOMPurify.sanitize(listing.content || "", {
            ALLOWED_TAGS: ["p"],
            ALLOWED_ATTR: [],
          }).substring(0, 100) + "...";

          return (
            <div
              key={listing.slug}
              style={{
                border: "1px solid #eaeaea",
                padding: "2rem",
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden" // Ensure image doesn't bleed out of rounded corners
              }}
            >
              {listing.imageGallery?.nodes?.[0]?.sourceUrl && (
                <div style={{ height: "200px", margin: "-2rem -2rem 1.5rem -2rem", position: "relative" }}>
                  <img 
                    src={listing.imageGallery.nodes[0].sourceUrl} 
                    alt={listing.title} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  />
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <span style={{ 
                  backgroundColor: "#f0f0f0", 
                  padding: "0.4rem 0.8rem", 
                  borderRadius: "20px", 
                  fontSize: "0.8rem", 
                  fontWeight: "600",
                  textTransform: "uppercase",
                  color: "#666"
                }}>
                  {category?.name || "General"}
                </span>
                {averageRating && (
                  <span style={{ fontSize: "0.9rem", color: "#f39c12", fontWeight: "bold" }}>
                    ★ {averageRating}
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: "1.6rem", marginBottom: "0.75rem" }}>
                {listing.title}
              </h2>

              <div
                style={{ color: "#555", marginBottom: "1.5rem", fontSize: "0.95rem", lineHeight: "1.5" }}
                dangerouslySetInnerHTML={{ __html: cleanContent }}
              />

              <div style={{ fontSize: "0.9rem", color: "#777", marginBottom: "1.5rem" }}>
                <p style={{ margin: "0.3rem 0" }}>📍 {listing.addressStreet}, {listing.addressCity}</p>
                <p style={{ margin: "0.3rem 0" }}>📞 {listing.phoneNumber}</p>
              </div>

              <Link 
                href={`/directory/${categorySlug}/${listing.slug}`}
                style={{ 
                  marginTop: "auto",
                  textAlign: "center",
                  padding: "1rem",
                  backgroundColor: "#0070f3",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  transition: "background 0.2s"
                }}
              >
                View Listing
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
