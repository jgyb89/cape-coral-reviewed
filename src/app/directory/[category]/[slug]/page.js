import DOMPurify from "isomorphic-dompurify";
import Script from "next/script";
import Image from "next/image";
import { getListingBySlug } from "@/lib/api";
import ContactCard from "@/components/directory/ContactCard";
import HoursCard from "@/components/directory/HoursCard";
import ReviewList from "@/components/directory/ReviewList";
import "./ListingPage.css";

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

  const reviewNodes = listing.reviews?.map(edge => edge.node) || [];
  const reviewCount = reviewNodes.length;
  const averageRating = reviewCount > 0 
    ? (reviewNodes.reduce((acc, curr) => acc + (curr.starRating || 0), 0) / reviewCount).toFixed(1)
    : null;

  const galleryNodes = listing.imageGallery?.nodes || [];
  const heroImage = listing.featuredImage?.node?.sourceUrl || galleryNodes[0]?.sourceUrl || "/placeholder-image.jpg";

  const cleanContent = DOMPurify.sanitize(listing.content || "", {
    ALLOWED_TAGS: ["p", "br", "b", "i", "em", "strong", "a", "ul", "ol", "li", "h3", "h4"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });

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
    <div className="listing-page">
      <Script
        id="listing-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="listing-hero">
        <Image 
          src={heroImage} 
          alt={listing.title} 
          fill 
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      <header className="listing-header">
        <div className="listing-header__container">
          <div className="listing-header__info">
            <h1 className="listing-header__title">{listing.title}</h1>
            <div className="ccr-card__rating" style={{ justifyContent: 'flex-start', marginBottom: '0' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-secondary)' }}>
                star
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-text)' }}>
                {averageRating || "0.0"}
              </span>
              <span style={{ color: '#666', fontSize: '0.9rem', marginLeft: '0.5rem' }}>
                ({reviewCount} reviews)
              </span>
            </div>
          </div>
          <div className="listing-header__actions">
            <button className="btn-primary">
              <span className="material-symbols-outlined">rate_review</span>
              Write a Review
            </button>
            <button className="btn-secondary">
              <span className="material-symbols-outlined">favorite_border</span>
              Favorite
            </button>
            <button className="btn-secondary">
              <span className="material-symbols-outlined">share</span>
              Share
            </button>
          </div>
        </div>
      </header>

      <div className="listing-body">
        <main>
          <section className="listing-section">
            <h2 className="listing-section__title">Overview</h2>
            <div
              className="listing-section__content"
              style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#333" }}
              dangerouslySetInnerHTML={{ __html: cleanContent }}
            />
          </section>

          {listing.videoUrl && (
            <section className="listing-section">
              <h2 className="listing-section__title">Video</h2>
              {/* Video embed logic would go here */}
            </section>
          )}

          <section className="listing-section">
            <h2 className="listing-section__title">Reviews</h2>
            <ReviewList reviews={reviewNodes} />
          </section>
        </main>

        <aside>
          <div style={{ position: "sticky", top: "2rem" }}>
            <div style={{ marginBottom: "2rem" }}>
              <ContactCard contactInfo={contactInfo} />
            </div>
            <HoursCard hours={hoursData} />
            
            {/* Featured Listings Placeholder */}
            <div style={{ marginTop: "3rem" }}>
              <h3 className="listing-section__title" style={{ fontSize: '1.2rem' }}>Featured Listings</h3>
              {/* Featured Listings Grid/List would go here */}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
