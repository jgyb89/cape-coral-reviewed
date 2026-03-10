// src/app/dashboard/layout.js
import Link from 'next/link';
import { getViewer } from '@/lib/auth';
import { redirect } from 'next/navigation';
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
              Profile Settings
            </Link>
          </li>
          <li className="dashboard-nav__item">
            <Link href="/dashboard/favorites" className="dashboard-nav__link">
              <span className="material-symbols-outlined" style={{ marginRight: '8px' }}>favorite</span>
              Favorite Listings
            </Link>
          </li>
          <li className="dashboard-nav__item">
            <Link href="/dashboard/reviews" className="dashboard-nav__link">
              <span className="material-symbols-outlined" style={{ marginRight: '8px' }}>rate_review</span>
              My Reviews
            </Link>
          </li>

          {isBusiness && (
            <>
              <li className="dashboard-nav__item">
                <Link href="/dashboard/submit-listing" className="dashboard-nav__link">
                  <span className="material-symbols-outlined" style={{ marginRight: '8px' }}>add_business</span>
                  Submit Listing
                </Link>
              </li>
              <li className="dashboard-nav__item">
                <Link href="/dashboard/edit-listings" className="dashboard-nav__link">
                  <span className="material-symbols-outlined" style={{ marginRight: '8px' }}>edit_note</span>
                  Edit Listings
                </Link>
              </li>
            </>
          )}

          <li className="dashboard-nav__item" style={{ marginTop: 'auto' }}>
            <Link href="/logout" className="dashboard-nav__link dashboard-nav__link--signout">
              <span className="material-symbols-outlined" style={{ marginRight: '8px' }}>logout</span>
              Sign Out
            </Link>
          </li>
        </ul>
      </aside>

      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
}
