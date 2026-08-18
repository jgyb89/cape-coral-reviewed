import PropTypes from "prop-types";
import { Suspense } from "react";
import Link from "next/link";
import { getListingsByCategory } from "@/lib/api";
import { getDictionary } from "@/lib/dictionaries";
import DirectoryFilterManager from "@/components/directory/DirectoryFilterManager";

export async function generateMetadata({ params, searchParams }) {
  const { directoryType, categorySlug } = await params;
  const capitalizedType = directoryType.charAt(0).toUpperCase() + directoryType.slice(1).replace(/-/g, ' ');
  const capitalizedCategory = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace(/-/g, ' ');
  
  const queryParams = await searchParams;
  const hasQueryParams = Object.keys(queryParams || {}).length > 0;

  const listings = await getListingsByCategory(categorySlug, directoryType);
  const shouldIndex = listings && listings.length > 0 && !hasQueryParams;

  return {
    title: `${capitalizedCategory} in ${capitalizedType} - Cape Coral Reviewed`,
    description: `Browse the best ${capitalizedCategory} in ${capitalizedType} in Cape Coral, Florida. Read reviews and find contact information.`,
    robots: { index: shouldIndex, follow: true }
  };
}

export default async function CategoryPage({ params }) {
  const { locale, directoryType, categorySlug } = await params;
  const dict = await getDictionary(locale);
  const listings = await getListingsByCategory(categorySlug, directoryType);
  const currentUser = null;

  // Derive category data from the first listing if available
  const categoryNode = listings[0]?.ccrlistingcategories?.nodes?.find(n => n.slug === categorySlug);
  const categoryName = categoryNode?.name || categorySlug.replace(/-/g, ' ');
  const categoryDescription = categoryNode?.description || "";

  return (
    <main style={{ padding: "clamp(1.5rem, 4vw, 3rem) 1rem 0", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <header style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h1 style={{ 
          fontFamily: 'var(--font-heading)', 
          fontSize: 'clamp(1.75rem, 6vw, 3.5rem)', 
          fontWeight: '800', 
          lineHeight: '1.1',
          marginTop: '1rem',
          marginBottom: '0.5rem',
          color: 'var(--color-text)',
          textTransform: 'capitalize'
        }}>
          Best {categoryName} in Cape Coral
        </h1>
        {categoryDescription && (
          <div style={{ maxWidth: "800px", margin: "0 auto", color: "#4a5568", lineHeight: "1.6", fontSize: "1.1rem" }} dangerouslySetInnerHTML={{ __html: categoryDescription }} />
        )}
      </header>

      <Suspense fallback={<div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading listings...</div>}>
        <DirectoryFilterManager listings={listings} currentUser={currentUser} dict={dict} locale={locale} />
      </Suspense>
    </main>
  );
}

CategoryPage.propTypes = {
  params: PropTypes.object.isRequired,
};
