import React from "react";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
import { getEventBySlug, getEvents } from "@/lib/graphql/events";
import { formatImageUrl } from "@/lib/formatImageUrl";
import BackButton from "@/components/blog/BackButton";
import EventMap from "@/components/events/EventMap";
import { getViewer } from "@/lib/auth";
import EventCommentManager from "@/components/events/EventCommentManager";
import EventCommentList from "@/components/events/EventCommentList";
import EventCard from "@/components/events/EventCard";
import FavoriteButton from "@/components/directory/FavoriteButton";
import ShareButton from "@/components/directory/ShareButton";
import { expandRecurringEvents } from "@/lib/eventUtils";
import AdUnit from "@/components/ads/AdUnit";
import "../../listing/[slug]/ListingPage.css";
import "./EventPage.css";
export async function generateMetadata({
  params
}) {
  const {
    slug
  } = await params;
  const event = await getEventBySlug(slug);
  if (!event) {
    return {
      title: "Event Not Found - Cape Coral Reviewed"
    };
  }
  const title = `${event.title} - Cape Coral Events`;
  const description = "Discover this upcoming event in Cape Coral.";
  const ogImage = formatImageUrl(event.featuredImage?.node?.sourceUrl);
  const contentHtml = event.content || "";
  const rawTextLength = contentHtml.replace(/<[^>]*>?/gm, '').trim().length;
  const isGhostEvent = rawTextLength < 50;
  return {
    title,
    description,
    robots: {
      index: !isGhostEvent,
      follow: true
    },
    openGraph: {
      title,
      description,
      images: ogImage ? [{
        url: ogImage
      }] : []
    }
  };
}
const formatEventbriteDateRange = (startStr, endStr) => {
  if (!startStr) return {
    dateString: "Date TBA",
    timeString: ""
  };
  const start = new Date(startStr);
  const end = endStr ? new Date(endStr) : null;
  if (Number.isNaN(start.getTime())) return {
    dateString: startStr,
    timeString: ""
  };
  const timeOpts = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  };
  const dateOpts = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  };
  const startTime = new Intl.DateTimeFormat("en-US", timeOpts).format(start);
  const startDate = new Intl.DateTimeFormat("en-US", dateOpts).format(start);
  if (!end || Number.isNaN(end.getTime())) {
    return {
      dateString: startDate,
      timeString: startTime
    };
  }
  const endTime = new Intl.DateTimeFormat("en-US", timeOpts).format(end);
  const endDate = new Intl.DateTimeFormat("en-US", dateOpts).format(end);

  // Same Day
  if (startDate === endDate) {
    return {
      dateString: startDate,
      timeString: `${startTime} - ${endTime}`
    };
  }

  // Different Days
  return {
    dateString: `${startDate} – ${endDate}`,
    timeString: `${startTime} to ${endTime}`
  };
};
export default async function SingleEventPage({
  params
}) {
  const {
    slug,
    locale
  } = await params;
  const event = await getEventBySlug(slug);
  const currentUser = await getViewer();
  const initialIsFavorite = currentUser?.userData?.favoriteListings?.nodes?.some(n => n.databaseId === event?.databaseId) || false;
  if (!event) {
    return <main className="inline-style-1">
        <h1>Event Not Found</h1>
        <p>The event you are looking for does not exist or has been removed.</p>
        <div className="inline-style-2">
          <BackButton locale={locale} fallback="/events" />
        </div>
      </main>;
  }
  const allEvents = await getEvents();
  const now = new Date();
  const recommendedEvents = allEvents.filter(e => (e.status === "PUBLISH" || e.status === "publish") && e.databaseId !== event.databaseId).filter(e => {
    const startStr = e.eventDetails?.startDateTime || e.date;
    const endStr = e.eventDetails?.endDateTime || startStr;
    const endDate = new Date(endStr.replace(" ", "T"));

    // Ensure currently ongoing events are still recommended
    return endDate >= now;
  }).slice(0, 3);
  const {
    title,
    content,
    featuredImage,
    eventDetails
  } = event;
  const imageUrl = formatImageUrl(featuredImage?.node?.sourceUrl);
  let rawStartDate = eventDetails?.startDateTime || eventDetails?.startDate || eventDetails?.start_date;
  let rawEndDate = eventDetails?.endDateTime || eventDetails?.endDate || eventDetails?.end_date;
  const isRecurring = eventDetails?.isRecurring;
  if (isRecurring && eventDetails?.recurrenceRule) {
    const virtuals = expandRecurringEvents([event]); // Transposes to the single next occurrence
    if (virtuals.length > 0) {
      // Replace with the immediate next occurrence
      rawStartDate = virtuals[0].eventDetails?.startDateTime;
      rawEndDate = virtuals[0].eventDetails?.endDateTime;
    }
  }
  const {
    dateString,
    timeString
  } = formatEventbriteDateRange(rawStartDate, rawEndDate);
  const venueName = eventDetails?.venueName || "Venue TBA";
  const rawPrice = eventDetails?.price || "";
  const isFree = !rawPrice || rawPrice.toLowerCase() === "free" || rawPrice === "0" || rawPrice === "$0";
  const ticketUrl = eventDetails?.ticketUrl || eventDetails?.ticket_url;
  const hasTicketUrl = Boolean(ticketUrl);
  const price = rawPrice && rawPrice.toLowerCase() !== "free" && !rawPrice.startsWith("$") ? `$${rawPrice}` : rawPrice || "Free";
  const addressObj = eventDetails?.eventAddress;
  const addressString = addressObj?.streetAddress || addressObj?.address || "";
  return <main className="inline-style-3">
        {/* Full-width Blurred Hero Backdrop */}
        <div className="inline-style-4">
          {imageUrl && <>
              <Image src={imageUrl} alt="" fill priority className="inline-style-5" />
              <Image src={imageUrl} alt={title} fill priority className="inline-style-6" />
            </>}
        </div>

        {/* 1200px Container */}
        <div className="inline-style-7">
          <div className="inline-style-8">
            <BackButton locale={locale} fallback="/events" />
            <div className="inline-style-9">
              <FavoriteButton listingId={event.databaseId} initialIsFavorite={initialIsFavorite} currentUser={currentUser} label="Favorite" />
              <ShareButton title={title} text={`Check out ${title} on Cape Coral Reviewed!`} />
            </div>
          </div>

          <div className="inline-style-10">
            {/* Left Column */}
            <div className="inline-style-11">
              <h1 className="inline-style-12">
                {title}
              </h1>

              <div className="inline-style-13" />

              <section className="listing-card">
                <h2 className="listing-card__title">
                  <span className="material-symbols-outlined">info</span>{" "}
                  About this event
                </h2>
                {content ? <div className="listing-card__text" dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(content)
            }} /> : <p className="listing-card__text">
                    No additional details provided.
                  </p>}
              </section>

              <section className="listing-card">
                <h2 className="listing-card__title">
                  <span className="material-symbols-outlined">location_on</span>{" "}
                  Location
                </h2>
                <div className="listing-card__item">
                  <span className="material-symbols-outlined listing-card__icon">
                    place
                  </span>
                  <div className="listing-card__text">
                    <strong>{venueName}</strong>
                    {addressString && <div>{addressString}</div>}
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addressString || venueName)}`} target="_blank" rel="noopener noreferrer" className="listing-card__link inline-style-14">
                      Show map
                    </a>
                  </div>
                </div>
                <div className="inline-style-15">
                  <div className="inline-style-16">
                    <EventMap lat={addressObj?.latitude} lng={addressObj?.longitude} address={addressString || venueName} />
                  </div>
                </div>
              </section>

              <section id="reviews" className="listing-card">
                <div className="reviews-section-header">
                  <h3 className="review-list__header">
                    Discussion ({event.commentCount || 0})
                  </h3>
                  <EventCommentManager eventId={event.databaseId} eventSlug={slug} currentUser={currentUser} locale={locale} />
                </div>
                <EventCommentList comments={event.comments} currentUser={currentUser} />
              </section>
            </div>

            {/* Right Column (Sticky) */}
            <div className="inline-style-17">
              <section className="listing-card inline-style-18">
                <h2 className="listing-card__title">
                  <span className="material-symbols-outlined">event</span>{" "}
                  Event Details
                </h2>

                {isRecurring && <div className="inline-style-19">
                    <span className="inline-style-20">
                      <span className="material-symbols-outlined inline-style-21">
                        update
                      </span>{" "}
                      Recurring Event
                    </span>
                  </div>}

                <div className="listing-card__item inline-style-22">
                  <span className="material-symbols-outlined listing-card__icon inline-style-23">
                    calendar_today
                  </span>
                  <div className="inline-style-24">
                    <span className="listing-card__text inline-style-25">
                      {dateString}
                    </span>
                    {timeString && <span className="inline-style-26">
                        {timeString}
                      </span>}
                  </div>
                </div>

                <div className="listing-card__item inline-style-27">
                  <span className="material-symbols-outlined listing-card__icon">
                    sell
                  </span>
                  <span className="listing-card__text inline-style-28">
                    {price}
                  </span>
                </div>

                <div className="inline-style-29">
                  {hasTicketUrl ? <a href={ticketUrl} target="_blank" rel="noopener noreferrer" className="listing-primary-btn event-cta-btn">
                      {isFree ? "Register / RSVP" : "Buy Tickets"}
                    </a> : <button className="listing-primary-btn event-cta-btn">
                      Save Event
                    </button>}
                </div>
              </section>
            </div>
          </div>

          {/* Recommended Events */}
          {recommendedEvents.length > 0 && <div className="inline-style-30">
              <h2 className="inline-style-31">
                Other events you may like
              </h2>
              <div className="inline-style-32">
                {recommendedEvents.map(recEvent => <EventCard key={recEvent.databaseId} event={recEvent} locale={locale} />)}
              </div>
            </div>}

          <div className="inline-style-33">
            <AdUnit type="horizontal" />
          </div>
        </div>
      </main>;
}