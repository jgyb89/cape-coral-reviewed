import Link from "next/link";
import { getListingsByDirectoryType } from "@/lib/api";
import { getViewer } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";
import DirectoryFilterManager from "@/components/directory/DirectoryFilterManager";

export async function generateMetadata({ params }) {
  const { directoryType } = await params;
  const capitalizedType = directoryType.charAt(0).toUpperCase() + directoryType.slice(1).replace(/-/g, ' ');
  
  return {
    title: `${capitalizedType} in Cape Coral - Cape Coral Reviewed`,
    description: `Browse the best ${capitalizedType} businesses in Cape Coral, Florida. Read reviews and find contact information.`,
  };
}

export default async function DirectoryTypePage({ params }) {
  const { locale, directoryType } = await params;
  const dict = await getDictionary(locale);
  const listings = await getListingsByDirectoryType(directoryType);
  const currentUser = await getViewer();

  const t = dict?.directory || {};

  // Derive directory type name from the first listing if available, or use the slug
  const typeName = listings[0]?.directoryTypes?.nodes.find(n => n.slug === directoryType)?.name || directoryType.replace(/-/g, ' ');

  return (
    <main style={{ padding: "3rem", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <header style={{ marginBottom: "3rem" }}>
        <Link href={`/${locale}/directory`} style={{ color: "#0070f3", textDecoration: "none", fontSize: "0.9rem" }}>← Back to Directory</Link>
        <h1 style={{ fontSize: "2.5rem", marginTop: "1rem", textTransform: "capitalize" }}>
          Best {typeName} in Cape Coral
        </h1>
        <p style={{ color: "#666" }}>
          {listings.length} {t.listingsFound || "listings found"}
        </p>
      </header>

      <DirectoryFilterManager listings={listings} currentUser={currentUser} dict={dict} locale={locale} />
    </main>
  );
}
