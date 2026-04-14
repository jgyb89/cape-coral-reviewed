import Image from "next/image";
import Link from "next/link";
import { getSidebarListings } from "@/lib/actions";
import { formatImageUrl } from "@/lib/formatImageUrl";
import styles from "./Blog.module.css";

export default async function BlogSidebar() {
  const listings = await getSidebarListings();

  return (
    <aside className={styles['blog-sidebar']}>
      <div className={styles['sidebar-widget']}>
        <h3 className={styles['sidebar-widget__title']}>Featured Listings</h3>
        <div className={styles['sidebar-listings-list']}>
          {listings.map((listing) => (
            <Link
              key={listing.databaseId}
              href={`/directory/general/${listing.slug}`}
              className={styles['sidebar-listing']}
            >
              <div className={styles['sidebar-listing__image']}>
                <Image
                  src={formatImageUrl(listing.featuredImage?.node?.sourceUrl)}
                  alt={listing.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className={styles['sidebar-listing__info']}>
                <h4 className={styles['sidebar-listing__title']}>{listing.title}</h4>
                <div className={styles['sidebar-listing__rating']}>
                  <span className={styles['sidebar-listing__stars']}>★★★★★</span>
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
