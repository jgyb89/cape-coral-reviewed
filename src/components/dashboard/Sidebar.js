import Link from 'next/link';
import PropTypes from 'prop-types';
import ProfileAvatar from './ProfileAvatar';

export default function Sidebar({ user, userRoles, locale }) {
  const isAdminOrBusiness = userRoles.includes('business') || userRoles.includes('administrator');

  return (
    <aside className="dashboard-nav">
      <ProfileAvatar user={user} />
      <ul className="dashboard-nav__list">
        <li className="dashboard-nav__item">
          <Link href={`/${locale}/dashboard`} className="dashboard-nav__link">
            <span className="material-symbols-outlined" style={{ marginRight: '8px' }}>person</span>
            <span>Profile Settings</span>
          </Link>
        </li>
        <li className="dashboard-nav__item">
          <Link href={`/${locale}/dashboard/favorites`} className="dashboard-nav__link">
            <span className="material-symbols-outlined" style={{ marginRight: '8px' }}>favorite</span>
            <span>Favorite Listings</span>
          </Link>
        </li>
        <li className="dashboard-nav__item">
          <Link href={`/${locale}/dashboard/reviews`} className="dashboard-nav__link">
            <span className="material-symbols-outlined" style={{ marginRight: '8px' }}>rate_review</span>
            <span>My Reviews</span>
          </Link>
        </li>

        {isAdminOrBusiness && (
          <li className="dashboard-nav__item">
            <Link href={`/${locale}/dashboard/listings`} className="dashboard-nav__link">
              <span className="material-symbols-outlined" style={{ marginRight: '8px' }}>storefront</span>
              <span>My Listings</span>
            </Link>
          </li>
        )}

        <li className="dashboard-nav__item" style={{ marginTop: 'auto' }}>
          <a href={`/${locale}/logout`} className="dashboard-nav__link dashboard-nav__link--signout">
            <span className="material-symbols-outlined" style={{ marginRight: '8px' }}>logout</span>
            <span>Sign Out</span>
          </a>
        </li>
      </ul>
    </aside>
  );
}

Sidebar.propTypes = {
  user: PropTypes.object.isRequired,
  userRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  locale: PropTypes.string.isRequired,
};
