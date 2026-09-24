import styles from "./page.module.css";
import PropTypes from "prop-types";
import { Suspense } from "react";
import { getListingsByDirectoryType } from "@/lib/api";
import { getDictionary } from "@/lib/dictionaries";
import DirectoryFilterManager from "@/components/directory/DirectoryFilterManager";
import DirectorySEO from "@/components/directory/DirectorySEO";
export async function generateMetadata({
  params,
  searchParams
}) {
  const {
    directoryType
  } = await params;
  const capitalizedType = directoryType.charAt(0).toUpperCase() + directoryType.slice(1).replaceAll(/-/g, ' ');
  const queryParams = await searchParams;
  const hasQueryParams = Object.keys(queryParams || {}).length > 0;
  return {
    title: `${capitalizedType} in Cape Coral - Cape Coral Reviewed`,
    description: `Browse the best ${capitalizedType} businesses in Cape Coral, Florida. Read reviews and find contact information.`,
    robots: {
      index: !hasQueryParams,
      follow: true
    }
  };
}
export default async function DirectoryTypePage({
  params
}) {
  const {
    locale,
    directoryType
  } = await params;
  const dict = await getDictionary(locale);
  const listings = await getListingsByDirectoryType(directoryType);
  const currentUser = null;

  // Derive directory type name from the first listing if available, or use the slug
  const typeNode = listings[0]?.directoryTypes?.nodes.find(n => n.slug === directoryType);
  const typeName = typeNode?.name || directoryType.replaceAll(/-/g, ' ');
  const typeDescription = typeNode?.description || "";
  return <>
      <div className="directory-page-wrapper">
        <header className={styles["inline-style-1"]}>
          <h1 className={styles["inline-style-2"]}>
            Best {typeName} in Cape Coral
          </h1>
          {typeDescription && <div dangerouslySetInnerHTML={{
          __html: typeDescription
        }} className={styles["inline-style-3"]} />}
        </header>

        <Suspense fallback={<div className={styles["inline-style-4"]}>Loading listings...</div>}>
          <DirectoryFilterManager listings={listings} currentUser={currentUser} dict={dict} locale={locale} />
        </Suspense>
      </div>
      <DirectorySEO directoryType={directoryType} />
    </>;
}
DirectoryTypePage.propTypes = {
  params: PropTypes.object.isRequired
};