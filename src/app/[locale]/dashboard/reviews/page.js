// src/app/dashboard/reviews/page.js
import { getViewer } from '@/lib/auth';
import MyReviews from '@/components/dashboard/MyReviews';

export const metadata = {
  title: 'My Reviews | Dashboard',
};

export default async function ReviewsPage({ params }) {
  const { locale } = await params;
  const viewer = await getViewer();

  // Redundancy check if middleware/layout is bypassed
  if (!viewer) {
    return (
      <div className="reviews-page">
        <h1 className="reviews-page__title">My Reviews</h1>
        <p className="reviews-page__error">You must be logged in to view your reviews.</p>
      </div>
    );
  }

  const reviews = viewer.ccrreviews?.nodes || [];

  return (
    <div className="reviews-page">
      <header className="reviews-page__header">
        <h1 className="reviews-page__title">My Reviews</h1>
        <p className="reviews-page__subtitle">
          Manage the reviews you have written for businesses in the directory.
        </p>
      </header>

      <div className="reviews-page__content">
        <MyReviews reviews={reviews} locale={locale} />
      </div>
    </div>
  );
}
