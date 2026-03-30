import DOMPurify from "isomorphic-dompurify";
import Script from "next/script";
import PropTypes from "prop-types";
import { getListingBySlug } from "@/lib/api";
import { getViewer } from "@/lib/auth";
import ListingGallery from "@/components/directory/ListingGallery";
import BlogSidebar from "@/components/blog/BlogSidebar";
import BackButton from "@/components/blog/BackButton";
import ReviewList from "@/components/directory/ReviewList";
import ReviewActionManager from "@/components/directory/ReviewActionManager";
import FavoriteButton from "@/components/directory/FavoriteButton";
import StarRating from "@/components/ui/StarRating";
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
  const currentUser = await getViewer();

  if (!listing) {
    return (
      <main style={{ padding: "3rem", textAlign: "center" }}>
        <h1>404: Listing Not Found</h1>
        <p>We couldn&apos;t find the business you&apos;re looking for.</p>
      </main>
    );
  }

  const listingdata = listing.listingdata || {};
  const reviewNodes = listing.reviews?.nodes || [];
  const reviewCount = reviewNodes.length;
  const averageRating = reviewCount > 0 
    ? (reviewNodes.reduce((acc, curr) => acc + (Number.parseFloat(curr.reviewFields?.starRating) || 0), 0) / reviewCount).toFixed(1)
    : null;

  const initialIsFavorite = currentUser?.userData?.favoriteListings?.nodes?.some(
    (n) => n.databaseId === listing.databaseId
  ) || false;

  const featuredImage = listing.featuredImage?.node?.sourceUrl || "";
  const galleryImages = listing.attachedMedia?.nodes?.map(node => node.sourceUrl) || [];

  const cleanContent = DOMPurify.sanitize(listing.content || "", {
    ALLOWED_TAGS: ["p", "br", "b", "i", "em", "strong", "a", "ul", "ol", "li", "h3", "h4"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": listing.title,
    "image": [featuredImage, ...galleryImages].filter(Boolean),
    "address": {
      "@type": "PostalAddress",
      "streetAddress": listingdata.addressStreet || "",
      "addressLocality": listingdata.addressCity || "Cape Coral",
      "addressRegion": listingdata.addressState || "FL",
      "postalCode": listingdata.addressZipCode || "",
      "addressCountry": "US"
    },
    "telephone": listingdata.phoneNumber || "",
    "url": listingdata.websiteUrl || `https://capecoralreviewed.com/directory/${category}/${slug}`,
    "priceRange": listingdata.priceRange ? "$".repeat(listingdata.priceRange) : undefined,
    "email": listingdata.businessEmail || undefined,
    "aggregateRating": averageRating ? {
      "@type": "AggregateRating",
      "ratingValue": averageRating,
      "reviewCount": reviewCount
    } : undefined
  };

  const hours = [
    { day: "Monday", time: listingdata.hoursMonday },
    { day: "Tuesday", time: listingdata.hoursTuesday },
    { day: "Wednesday", time: listingdata.hoursWednesday },
    { day: "Thursday", time: listingdata.hoursThursday },
    { day: "Friday", time: listingdata.hoursFriday },
    { day: "Saturday", time: listingdata.hoursSaturday },
    { day: "Sunday", time: listingdata.hoursSunday },
  ];

  return (
    <div className="listing-layout">
      <Script
        id="listing-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="listing-main">
        <div className="listing-top-actions">
          <BackButton />
          <div className="listing-action-group">
            <FavoriteButton 
              listingId={listing.databaseId} 
              initialIsFavorite={initialIsFavorite}
              currentUser={currentUser}
            />
            <button className="listing-action-btn">
              <span className="material-symbols-outlined">share</span>
              <span className="listing-action-btn__text">Share</span>
            </button>
            <button className="listing-action-btn">
              <span className="material-symbols-outlined">flag</span>
              <span className="listing-action-btn__text">Report</span>
            </button>
          </div>
        </div>

        <ListingGallery 
          featuredImage={featuredImage} 
          galleryImages={galleryImages} 
        />

        <header className="listing-header">
          <h1 className="listing-title">{listing.title}</h1>
          <div className="listing-header__meta">
            <div className="listing-header__rating">
              <StarRating rating={averageRating} />
              <span style={{ marginLeft: '0.5rem' }}>{averageRating || "0.0"} ({reviewCount} reviews)</span>
            </div>
            <div className="listing-header__categories">
              {listing.directoryTypes?.nodes?.map(cat => (
                <span key={cat.slug} className="listing-category-tag">{cat.name}</span>
              ))}
            </div>
          </div>
        </header>

        <section className="listing-card">
          <h2 className="listing-card__title">
            <span className="material-symbols-outlined">info</span>
            Business Info
          </h2>
          <div className="listing-card__item">
            <span className="material-symbols-outlined listing-card__icon">location_on</span>
            <span className="listing-card__text">
              {listingdata.addressStreet}, {listingdata.addressCity}, {listingdata.addressState} {listingdata.addressZipCode}
            </span>
          </div>
          <div className="listing-card__item">
            <span className="material-symbols-outlined listing-card__icon">call</span>
            <span className="listing-card__text">{listingdata.phoneNumber}</span>
          </div>
          {listingdata.websiteUrl && (
            <div className="listing-card__item">
              <span className="material-symbols-outlined listing-card__icon">language</span>
              <a href={listingdata.websiteUrl} className="listing-card__link" target="_blank" rel="noopener noreferrer">
                Visit Website
              </a>
            </div>
          )}
        </section>

        <section className="listing-card">
          <h2 className="listing-card__title">
            <span className="material-symbols-outlined">schedule</span>
            Business Hours
          </h2>
          {hours.map(h => (
            <div key={h.day} className="listing-card__item" style={{ justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600 }}>{h.day}</span>
              <span>{h.time || "Closed"}</span>
            </div>
          ))}
        </section>

        <section className="listing-card">
          <h2 className="listing-card__title">
            <span className="material-symbols-outlined">description</span>
            About the Business
          </h2>
          <div 
            className="listing-card__text"
            dangerouslySetInnerHTML={{ __html: cleanContent }}
          />
        </section>

        <section className="listing-card">
          <h2 className="listing-card__title">
            <span className="material-symbols-outlined">reviews</span>
            Recommended Reviews
          </h2>
          <div style={{ marginBottom: '2rem' }}>
            <ReviewActionManager 
              currentUser={currentUser} 
              listingId={listing.databaseId} 
              listingSlug={slug}
            />
          </div>
          <ReviewList reviews={listing.reviews} />
        </section>
      </main>

      <aside className="listing-sidebar">
        <div style={{ position: 'sticky', top: '2rem' }}>
          <div className="listing-card">
            <h3 className="listing-card__title" style={{ border: 'none', marginBottom: 0 }}>
              Add to Favorites
            </h3>
            <FavoriteButton listingId={listing.databaseId} currentUser={currentUser} />
          </div>
          <BlogSidebar />
        </div>
      </aside>
    </div>
  );
}

DirectoryListingPage.propTypes = {
  params: PropTypes.object.isRequired,
};
