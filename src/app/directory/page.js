import { getListings } from "@/lib/api";
import { getViewer } from "@/lib/auth";
import CcrCardGrid from "@/components/directory/CcrCardGrid";

export const metadata = {
  title: "Local Business Directory - Cape Coral Reviewed",
  description: "Browse our comprehensive directory of local businesses in Cape Coral, Florida.",
};

export default async function DirectoryIndexPage() {
  const listings = await getListings();
  const currentUser = await getViewer();

  return (
    <main
      style={{
        padding: "3rem",
        fontFamily: "sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <header style={{ marginBottom: "3rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "800", marginBottom: "1rem" }}>
          Business Directory
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#666" }}>
          Explore the best local services, restaurants, and shops in Cape Coral.
        </p>
      </header>

      <CcrCardGrid listings={listings} currentUser={currentUser} />
    </main>
  );
}
