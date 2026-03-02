// Notice there is NO "use client" at the top! This runs securely on the server.

async function getListings() {
  const query = `
    query GetDirectoryListings {
      ccrlistings {
        nodes {
          title
          content
          address
          phoneNumber
          hoursMonday
          ccrdirectorytypes {
            nodes {
              name
            }
          }
        }
      }
    }
  `;

  // We use standard native fetch pointing to your env variable
  const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
    // This tells Next.js to re-fetch fresh data every 60 seconds behind the scenes
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch directory data");
  }

  const json = await res.json();
  return json.data?.ccrlistings?.nodes || [];
}

export default async function DirectoryPage() {
  // We just 'await' the data directly inside the component
  const listings = await getListings();

  return (
    <main
      style={{
        padding: "3rem",
        fontFamily: "sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ marginBottom: "2rem", fontSize: "2.5rem" }}>
        Cape Coral Reviewed
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        {listings.map((listing, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #eaeaea",
              padding: "1.5rem",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
            }}
          >
            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
              {listing.title}
            </h2>

            <div
              style={{ color: "#555", marginBottom: "1rem" }}
              dangerouslySetInnerHTML={{ __html: listing.content }}
            />

            <div style={{ fontSize: "0.9rem", lineHeight: "1.6" }}>
              <p>
                <strong>📍 Address:</strong> {listing.address}
              </p>
              <p>
                <strong>📞 Phone:</strong> {listing.phoneNumber}
              </p>
              <p>
                <strong>🕒 Monday:</strong> {listing.hoursMonday}
              </p>
              <p>
                <strong>🏷️ Category:</strong>{" "}
                {listing.ccrdirectorytypes?.nodes[0]?.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
