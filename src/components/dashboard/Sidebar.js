import Link from 'next/link';
import PropTypes from 'prop-types';

export default function Sidebar({ userRoles }) {
  const isAdminOrBusiness = userRoles.includes('business') || userRoles.includes('administrator');

  return (
    <aside className="dashboard-nav">
      <ul className="dashboard-nav__list">
        <li className="dashboard-nav__item">
          <Link href="/dashboard" className="dashboard-nav__link">
            <span className="material-symbols-outlined" style={{ marginRight: '8px' }}>person</span>
            <span>Profile Settings</span>
          </Link>
        </li>
        <li className="dashboard-nav__item">
          <Link href="/dashboard/favorites" className="dashboard-nav__link">
            <span className="material-symbols-outlined" style={{ marginRight: '8px' }}>favorite</span>
            <span>Favorite Listings</span>
          </Link>
        </li>
        <li className="dashboard-nav__item">
          <Link href="/dashboard/reviews" className="dashboard-nav__link">
            <span className="material-symbols-outlined" style={{ marginRight: '8px' }}>rate_review</span>
            <span>My Reviews</span>
          </Link>
        </li>

        {isAdminOrBusiness && (
          <li className="dashboard-nav__item">
            <Link href="/dashboard/listings" className="dashboard-nav__link">
              <span className="material-symbols-outlined" style={{ marginRight: '8px' }}>storefront</span>
              <span>My Listings</span>
            </Link>
          </li>
        )}

        <li className="dashboard-nav__item" style={{ marginTop: 'auto' }}>
          <a href="/logout" className="dashboard-nav__link dashboard-nav__link--signout">
            <span className="material-symbols-outlined" style={{ marginRight: '8px' }}>logout</span>
            <span>Sign Out</span>
          </a>
        </li>
      </ul>
    </aside>
  );
}

Sidebar.propTypes = {
  userRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};
