import styles from "./page.module.css";
import { Suspense } from "react";
import { getListings } from "@/lib/api";
import { getDictionary } from "@/lib/dictionaries";
import DirectoryFilterManager from "@/components/directory/DirectoryFilterManager";
export async function generateMetadata({
  searchParams
}) {
  const queryParams = await searchParams;
  const hasQueryParams = Object.keys(queryParams || {}).length > 0;
  return {
    title: "Local Business Directory - Cape Coral Reviewed",
    description: "Browse our comprehensive directory of local businesses in Cape Coral, Florida.",
    robots: {
      index: !hasQueryParams,
      follow: true
    }
  };
}
export default async function DirectoryIndexPage({
  params
}) {
  const {
    locale
  } = await params;
  const dict = await getDictionary(locale);
  const listings = await getListings();
  const currentUser = null;
  const t = dict?.directory || {};
  return <div className="directory-page-wrapper">
      <header className={styles["inline-style-1"]}>
        <h1 className={styles["inline-style-2"]}>
          {t.title || "Business Directory"}
        </h1>
        <p className={styles["inline-style-3"]}>
          {t.subtitle || "Explore the best local services, restaurants, and shops in Cape Coral."}
        </p>
      </header>

      <Suspense fallback={<div className={styles["inline-style-4"]}>Loading listings...</div>}>
        <DirectoryFilterManager listings={listings} currentUser={currentUser} dict={dict} locale={locale} />
      </Suspense>
    </div>;
}