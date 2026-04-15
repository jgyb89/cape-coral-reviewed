import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { getSidebarListings } from "@/lib/actions";
import { formatImageUrl } from "@/lib/formatImageUrl";

export default async function BlogSidebar({ locale = "en" }) {
  const listings = await getSidebarListings();

  return (
    <aside className="blog-sidebar">
      <div className="sidebar-widget">
        <h3 className="sidebar-widget__title">Featured Listings</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {listings.map((item) => {
            const imageUrl = formatImageUrl(item.featuredImage?.node?.sourceUrl);
            const listingUrl = `/${locale}/listing/${item.slug}`;
            
            const reviewNodes = item.reviews?.nodes || [];
            const reviewCount = reviewNodes.length;
            const averageRating = reviewCount > 0 
              ? (reviewNodes.reduce((acc, curr) => acc + (Number.parseFloat(curr.reviewFields?.starRating) || 0), 0) / reviewCount).toFixed(1)
              : "0.0";

            return (
              <Link 
                key={item.databaseId} 
                href={listingUrl}
                className="sidebar-listing"
              >
                <div className="sidebar-listing__image" style={{ width: '80px', height: '80px' }}>
                  <Image
                    src={imageUrl}
                    alt={item.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="sidebar-listing__info">
                  <h4 className="sidebar-listing__title">{item.title}</h4>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Star size={14} fill="#d32323" color="#d32323" />
                    <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>{averageRating}</span>
                    <span style={{ fontSize: "0.8rem", color: "#666" }}>({reviewCount})</span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#888", marginTop: "2px" }}>
                    {item.directoryTypes?.nodes?.[0]?.name}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
