import { getListings } from "@/lib/api";
import { getViewer } from "@/lib/auth";
import HeroSlideshow from "@/components/home/HeroSlideshow";
import TabbedListingFeed from "@/components/home/TabbedListingFeed";
import HomeSidebar from "@/components/home/HomeSidebar";

export default async function HomePage() {
  const listings = await getListings();
  const currentUser = await getViewer();

  // For the prototype, we split the listings for different sections
  const featuredListings = listings.slice(0, 5);
  const popularNearYou = listings.slice(5, 10);
  const feedListings = listings;

  return (
    <main style={{ backgroundColor: "#fdfdfd", minHeight: "100vh" }}>
      {/* Hero Section */}
      <HeroSlideshow featuredListings={featuredListings} />

      {/* Main Content Layout */}
      <div
        style={{
          maxWidth: "1600px",
          margin: "40px auto",
          padding: "0 2vw",
        }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .home-layout-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 40px;
          }
          @media (min-width: 1024px) {
            .home-layout-grid {
              grid-template-columns: 1fr 3fr;
            }
          }
          .home-sidebar-wrapper {
            order: 2;
          }
          .home-feed-wrapper {
            order: 1;
          }
          @media (min-width: 1024px) {
            .home-sidebar-wrapper {
              order: 1;
            }
            .home-feed-wrapper {
              order: 2;
            }
          }
        `,
          }}
        />

        <div className="home-layout-grid">
          {/* Sidebar (Left on Desktop, Bottom on Mobile) */}
          <div className="home-sidebar-wrapper">
            <HomeSidebar
              featuredBusinesses={featuredListings}
              popularNearYou={popularNearYou}
            />
          </div>

          {/* Main Feed (Right on Desktop, Top on Mobile) */}
          <div className="home-feed-wrapper">
            <TabbedListingFeed
              initialListings={feedListings}
              currentUser={currentUser}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
