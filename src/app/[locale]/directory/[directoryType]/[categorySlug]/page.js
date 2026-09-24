import styles from "./page.module.css";
import PropTypes from "prop-types";
import { Suspense } from "react";
import { getListingsByCategory } from "@/lib/api";
import { getDictionary } from "@/lib/dictionaries";
import DirectoryFilterManager from "@/components/directory/DirectoryFilterManager";
export async function generateMetadata({
  params,
  searchParams
}) {
  const {
    directoryType,
    categorySlug
  } = await params;
  const capitalizedType = directoryType.charAt(0).toUpperCase() + directoryType.slice(1).replaceAll(/-/g, ' ');
  const capitalizedCategory = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replaceAll(/-/g, ' ');
  const queryParams = await searchParams;
  const hasQueryParams = Object.keys(queryParams || {}).length > 0;
  const listings = await getListingsByCategory(categorySlug, directoryType);
  const shouldIndex = listings && listings.length > 0 && !hasQueryParams;
  return {
    title: `${capitalizedCategory} in ${capitalizedType} - Cape Coral Reviewed`,
    description: `Browse the best ${capitalizedCategory} in ${capitalizedType} in Cape Coral, Florida. Read reviews and find contact information.`,
    robots: {
      index: shouldIndex,
      follow: true
    }
  };
}
export default async function CategoryPage({
  params
}) {
  const {
    locale,
    directoryType,
    categorySlug
  } = await params;
  const dict = await getDictionary(locale);
  const listings = await getListingsByCategory(categorySlug, directoryType);
  const currentUser = null;

  // Derive category data from the first listing if available
  const categoryNode = listings[0]?.ccrlistingcategories?.nodes?.find(n => n.slug === categorySlug);
  const categoryName = categoryNode?.name || categorySlug.replaceAll(/-/g, ' ');
  const categoryDescription = categoryNode?.description || "";
  return <div className="directory-page-wrapper">
      <header className={styles["inline-style-1"]}>
        <h1 className={styles["inline-style-2"]}>
          Best {categoryName} in Cape Coral
        </h1>
        {categoryDescription && <div dangerouslySetInnerHTML={{
        __html: categoryDescription
      }} className={styles["inline-style-3"]} />}
      </header>

      <Suspense fallback={<div className={styles["inline-style-4"]}>Loading listings...</div>}>
        <DirectoryFilterManager listings={listings} currentUser={currentUser} dict={dict} locale={locale} />
      </Suspense>
    </div>;
}
CategoryPage.propTypes = {
  params: PropTypes.object.isRequired
};