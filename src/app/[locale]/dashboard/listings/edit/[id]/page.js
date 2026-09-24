import styles from "./page.module.css";
import PropTypes from "prop-types";
import { getListingForEdit } from "@/lib/actions";
import EditListingForm from "@/components/dashboard/EditListingForm";
import Link from "next/link";
import { notFound } from "next/navigation";
export default async function EditListingPage({
  params
}) {
  const {
    id,
    locale
  } = await params;
  const listing = await getListingForEdit(id);
  if (!listing) {
    notFound();
  }
  return <div className="edit-listing-page">
      <Link href={`/dashboard`} className="dashboard-back-btn">
        <span className="material-symbols-outlined">arrow_back</span>{" "}Back to Dashboard
      </Link>
      <div className={styles["inline-style-1"]}>
        <Link href={`/dashboard/listings`} className={styles["inline-style-2"]}>
          <span className="material-symbols-outlined">arrow_back</span>{" "}
          Back to My Listings
        </Link>
      </div>

      <header className={styles["inline-style-3"]}>
        <h1 className={styles["inline-style-4"]}>
          Edit Listing
        </h1>
        <p className={styles["inline-style-5"]}>
          Update your business information below.
        </p>
      </header>

      <EditListingForm initialData={listing} />
    </div>;
}
EditListingPage.propTypes = {
  params: PropTypes.object.isRequired
};