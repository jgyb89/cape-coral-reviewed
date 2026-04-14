// src/app/dashboard/favorites/page.js
import { getViewer } from '@/lib/auth';
import FavoriteListings from '@/components/dashboard/FavoriteListings';

export const metadata = {
  title: 'Favorite Listings | Dashboard',
};

export default async function FavoritesPage({ params }) {
  const { locale } = await params;
  const viewer = await getViewer();

  // Handle case where viewer is null (though middleware/layout should prevent this)
  if (!viewer) {
    return (
      <div className="favorites-page">
        <h1 className="favorites-page__title">Favorite Listings</h1>
        <p className="favorites-page__error">You must be logged in to view your favorites.</p>
      </div>
    );
  }

  const favorites = viewer.userData?.favoriteListings?.nodes || [];

  return (
    <div className="favorites-page">
      <header className="favorites-page__header">
        <h1 className="favorites-page__title">Favorite Listings</h1>
        <p className="favorites-page__subtitle">
          Manage your saved business listings here.
        </p>
      </header>

      <div className="favorites-page__content">
        <FavoriteListings favorites={favorites} locale={locale} />
      </div>
    </div>
  );
}
