import DOMPurify from "isomorphic-dompurify";
import Script from "next/script";
import { getListingBySlug } from "@/lib/api";
import ContactCard from "@/components/directory/ContactCard";
import HoursCard from "@/components/directory/HoursCard";
import ImageGallery from "@/components/directory/ImageGallery";
import ReviewList from "@/components/directory/ReviewList";

// 1. Implementing Dynamic generateMetadata
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);

  if (!listing) {
    return {
      title: "Listing Not Found - Cape Coral Reviewed",
    };
  }

  const seoTitle = listing.seo?.title || `${listing.title} - Cape Coral Reviewed`;
  const seoDesc = listing.seo?.metaDesc || `Find details, reviews, and contact info for ${listing.title} in Cape Coral, FL.`;
  const ogImage = listing.seo?.opengraphImage?.sourceUrl;

  return {
    title: seoTitle,
    description: seoDesc,
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      images: ogImage ? [{ url: ogImage }] : [],
    },
  };
}

export default async function DirectoryListingPage({ params }) {
  const { slug, category } = await params;
  const listing = await getListingBySlug(slug);

  if (!listing) {
    return (
      <main style={{ padding: "3rem", textAlign: "center" }}>
        <h1>404: Listing Not Found</h1>
        <p>We couldn't find the business you're looking for.</p>
      </main>
    );
  }

  // Calculate Review Data mathematically from relationship nodes
  // Unpack the edges into a clean array of review nodes
  const reviewNodes = listing.reviews?.map(edge => edge.node) || [];
  
  const reviewCount = reviewNodes.length;
  const averageRating = reviewCount > 0 
    ? (reviewNodes.reduce((acc, curr) => acc + (curr.starRating || 0), 0) / reviewCount).toFixed(1)
    : null;

  // Calculate gallery nodes
  const galleryNodes = listing.imageGallery?.nodes || [];

  // Sanitize WordPress content
  const cleanContent = DOMPurify.sanitize(listing.content || "", {
    ALLOWED_TAGS: ["p", "br", "b", "i", "em", "strong", "a", "ul", "ol", "li", "h3", "h4"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });

  // 2. Mapping the LocalBusiness JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": listing.title,
    "image": galleryNodes.map(img => img.sourceUrl) || [],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": listing.addressStreet || "",
      "addressLocality": listing.addressCity || "Cape Coral",
      "addressRegion": listing.addressState || "FL",
      "postalCode": listing.addressZipCode || "",
      "addressCountry": "US"
    },
    "telephone": listing.phoneNumber || "",
    "url": listing.websiteUrl || `https://capecoralreviewed.com/directory/${category}/${slug}`,
    "priceRange": listing.priceRange ? "$".repeat(listing.priceRange) : undefined,
    "email": listing.businessEmail || undefined,
    "aggregateRating": averageRating ? {
      "@type": "AggregateRating",
      "ratingValue": averageRating,
      "reviewCount": reviewCount
    } : undefined
  };

  // Group data for sub-components
  const contactInfo = {
    addressStreet: listing.addressStreet,
    addressCity: listing.addressCity,
    addressState: listing.addressState,
    addressZipCode: listing.addressZipCode,
    phoneNumber: listing.phoneNumber,
    businessEmail: listing.businessEmail,
    websiteUrl: listing.websiteUrl,
    socialUrl: listing.socialUrl
  };

  const hoursData = {
    hoursMonday: listing.hoursMonday,
    hoursTuesday: listing.hoursTuesday,
    hoursWednesday: listing.hoursWednesday,
    hoursThursday: listing.hoursThursday,
    hoursFriday: listing.hoursFriday,
    hoursSaturday: listing.hoursSaturday,
    hoursSunday: listing.hoursSunday
  };

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem", fontFamily: "sans-serif" }}>
      {/* Inject JSON-LD */}
      <Script
        id="listing-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Media Section */}
      <ImageGallery images={galleryNodes} videoUrl={listing.videoUrl} />
      
      <section style={{ marginBottom: "2.5rem", marginTop: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "2.8rem", marginBottom: "0.5rem" }}>{listing.title}</h1>
            <p style={{ fontSize: "1.1rem", color: "#666" }}>
              📍 {listing.addressStreet}, {listing.addressCity}, {listing.addressState} {listing.addressZipCode}
            </p>
            {averageRating && (
              <div style={{ fontSize: "1.2rem", color: "#f39c12", marginTop: "0.5rem" }}>
                {"★".repeat(Math.round(averageRating))}
                {"☆".repeat(5 - Math.round(averageRating))}
                <span style={{ color: "#666", fontSize: "0.9rem", marginLeft: "0.5rem" }}>
                  ({averageRating} from {reviewCount} reviews)
                </span>
              </div>
            )}
          </div>
          {listing.priceRange && (
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#27ae60" }}>
              {"$".repeat(listing.priceRange)}
            </div>
          )}
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "3rem" }}>
        {/* Left Column */}
        <section>
          <div style={{ marginBottom: "3rem" }}>
            <h2 style={{ borderBottom: "2px solid #eee", paddingBottom: "0.5rem", marginBottom: "1.5rem" }}>About this Business</h2>
            <div
              style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#333" }}
              dangerouslySetInnerHTML={{ __html: cleanContent }}
            />
          </div>

          {/* User Reviews Section */}
          <ReviewList reviews={reviewNodes} />
        </section>

        {/* Right Column (Sidebar) */}
        <aside>
          <div style={{ position: "sticky", top: "2rem" }}>
            {/* Contact Card Component */}
            <div style={{ marginBottom: "2rem" }}>
              <ContactCard contactInfo={contactInfo} />
            </div>

            {/* Hours Card Component */}
            <HoursCard hours={hoursData} />

            <button style={{ width: "100%", padding: "1rem", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", marginTop: "2rem" }}>
              Leave a Review
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
