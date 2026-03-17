import { getListings } from "@/lib/api";
import { getViewer } from "@/lib/auth";
import CcrCardGrid from "@/components/directory/CcrCardGrid";

export default async function DirectoryPage() {
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
          Cape Coral Reviewed
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#666" }}>
          Discover the best local businesses in Cape Coral, Florida.
        </p>
      </header>

      <CcrCardGrid listings={listings} currentUser={currentUser} />
    </main>
  );
}
