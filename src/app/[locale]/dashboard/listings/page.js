import styles from "./page.module.css";
import PropTypes from 'prop-types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DeleteListingButton from '@/components/dashboard/DeleteListingButton';
import Pagination from '@/components/common/Pagination';
import DashboardSortDropdown from '@/components/dashboard/DashboardSortDropdown';
function sortListings(listings, sort) {
  const sorted = [...listings];
  switch (sort) {
    case 'az':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'za':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    default:
      return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
}
async function fetchMyListings(authToken) {
  const query = `
    query GetMyListings {
      viewer {
        roles { nodes { name } }
        ccrlistings(first: 1000) {
          nodes {
            databaseId
            title
            slug
            date
          }
        }
      }
    }
  `;
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
        'User-Agent': 'CCR-NextJS-Frontend/1.0'
      },
      body: JSON.stringify({
        query
      }),
      cache: 'no-store'
    });
    if (res.ok) {
      const contentType = res.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        return await res.json();
      }
      console.error(`Unexpected content-type in listings page: ${contentType}`);
    } else {
      console.error(`HTTP Error in listings page: status ${res.status}`);
    }
  } catch (error) {
    console.error("Failed to parse JSON on listings page:", error);
  }
  return null;
}
export default async function MyListingsPage({
  params,
  searchParams
}) {
  const {
    locale
  } = await params;
  const resolvedSearchParams = await searchParams;
  const page = Number.parseInt(resolvedSearchParams?.page || '1', 10);
  const sort = resolvedSearchParams?.sort || 'newest';
  const ITEMS_PER_PAGE = 10;
  const cookieStore = await cookies();
  const authToken = cookieStore.get('authToken')?.value;
  if (!authToken) {
    redirect(``);
  }
  const json = await fetchMyListings(authToken);
  const viewer = json?.data?.viewer;
  if (!viewer) {
    redirect(`/dashboard`);
  }
  const roles = new Set(viewer.roles.nodes.map(r => r.name.toLowerCase()));
  if (!roles.has('business') && !roles.has('administrator')) {
    redirect(`/dashboard`);
  }
  const listings = viewer.ccrlistings?.nodes || [];
  const sortedListings = sortListings(listings, sort);
  const paginatedListings = sortedListings.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  return <div className="my-listings-page">
      <Link href={`/dashboard`} className="dashboard-back-btn">
        <span className="material-symbols-outlined">arrow_back</span>{" "}Back to Dashboard
      </Link>
      <header className={styles["dashboard-listings__header"]}>
        <div>
          <h1 className={styles["dashboard-listings__title"]}>My Listings</h1>
          <p className={styles["dashboard-listings__subtitle"]}>Manage your business listings and update their details.</p>
        </div>
        <Link href={`/submit-listing`} className={`listing-primary-btn ${styles["dashboard-listings__add-btn"]}`}>
          <span className="material-symbols-outlined">add_business</span>{" "}
          Add New Listing
        </Link>
      </header>

      {listings.length === 0 ? <div className={`blank-state ${styles["dashboard-listings__empty-state"]}`}>
          <p className={styles["dashboard-listings__empty-text"]}>You haven&apos;t posted any listings yet.</p>
          <Link href={`/submit-listing`} className={styles["dashboard-listings__empty-link"]}>Create your first listing now</Link>
        </div> : <>
          <DashboardSortDropdown />
          <div className={`listings-grid ${styles["dashboard-listings__grid"]}`}>
            {paginatedListings.map(listing => <div key={listing.databaseId} className={`listing-item ${styles["dashboard-listings__card"]}`}>
                <div>
                  <h3 className={styles["dashboard-listings__card-title"]}>{listing.title}</h3>
                  <p className={styles["dashboard-listings__card-date"]}>
                    Published on {new Date(listing.date).toLocaleDateString()}
                  </p>
                </div>
                <div className={styles["dashboard-listings__card-actions"]}>
                  <Link href={`/listing/${listing.slug}`} className={styles["dashboard-listings__action-view"]}>
                    View
                  </Link>
                  <span className={styles["dashboard-listings__action-divider1"]}>|</span>
                  <Link href={`/dashboard/listings/edit/${listing.databaseId}`} className={styles["dashboard-listings__action-edit"]}>
                    Edit
                  </Link>
                  <span className={styles["dashboard-listings__action-divider2"]}>|</span>
                  <DeleteListingButton listingId={listing.databaseId} className="btn-delete" />
                </div>
              </div>)}
            <Pagination totalItems={listings.length} itemsPerPage={ITEMS_PER_PAGE} />
          </div>
        </>}
    </div>;
}
MyListingsPage.propTypes = {
  params: PropTypes.object.isRequired,
  searchParams: PropTypes.object.isRequired
};