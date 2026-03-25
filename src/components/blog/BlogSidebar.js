import Image from "next/image";
import Link from "next/link";
import { getSidebarListings } from "@/lib/actions";

export default async function BlogSidebar() {
  const listings = await getSidebarListings();

  return (
    <aside className="blog-sidebar">
      <div className="sidebar-widget">
        <h3 className="sidebar-widget__title">Featured Listings</h3>
        <div className="sidebar-listings-list">
          {listings.map((listing) => (
            <Link
              key={listing.databaseId}
              href={`/directory/general/${listing.slug}`}
              className="sidebar-listing"
            >
              <div className="sidebar-listing__image">
                <Image
                  src={listing.featuredImage?.node?.sourceUrl || "/placeholder-image.jpg"}
                  alt={listing.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="sidebar-listing__info">
                <h4 className="sidebar-listing__title">{listing.title}</h4>
                <div className="sidebar-listing__rating">
                  <span className="sidebar-listing__stars">★★★★★</span>
                  <span>5 (Reviews)</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
