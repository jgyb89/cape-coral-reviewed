// src/app/dashboard/layout.js
import Link from 'next/link';
import { getViewer } from '@/lib/auth';
import { redirect } from 'next/navigation';
import PropTypes from 'prop-types';
import './Dashboard.css';

export default async function DashboardLayout({ children }) {
  const viewer = await getViewer();

  // Redundancy check if middleware is bypassed
  if (!viewer) {
    redirect('/login');
  }

  const isBusiness = viewer.roles.nodes.some((role) => role.name === 'Business');

  return (
    <div className="dashboard-layout">
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

          {isBusiness && (
            <>
              <li className="dashboard-nav__item">
                <Link href="/dashboard/submit-listing" className="dashboard-nav__link">
                  <span className="material-symbols-outlined" style={{ marginRight: '8px' }}>add_business</span>
                  <span>Submit Listing</span>
                </Link>
              </li>
              <li className="dashboard-nav__item">
                <Link href="/dashboard/edit-listings" className="dashboard-nav__link">
                  <span className="material-symbols-outlined" style={{ marginRight: '8px' }}>edit_note</span>
                  <span>Edit Listings</span>
                </Link>
              </li>
            </>
          )}

          <li className="dashboard-nav__item" style={{ marginTop: 'auto' }}>
            <a href="/logout" className="dashboard-nav__link dashboard-nav__link--signout">
              <span className="material-symbols-outlined" style={{ marginRight: '8px' }}>logout</span>
              <span>Sign Out</span>
            </a>
          </li>
        </ul>
      </aside>

      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
