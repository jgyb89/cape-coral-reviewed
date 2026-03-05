// src/app/dashboard/layout.js
import Link from 'next/link';
import { getViewer } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }) {
  const viewer = await getViewer();

  // Redundancy check if middleware is bypassed
  if (!viewer) {
    redirect('/login');
  }

  const isBusiness = viewer.roles.nodes.some((role) => role.name === 'Business');

  return (
    <div className="dashboard">
      <aside className="dashboard__sidebar">
        <nav className="dashboard-nav">
          <ul className="dashboard-nav__list">
            <li className="dashboard-nav__item">
              <Link href="/dashboard" className="dashboard-nav__link">
                Profile Settings
              </Link>
            </li>
            <li className="dashboard-nav__item">
              <Link href="/dashboard/favorites" className="dashboard-nav__link">
                Favorite Listings
              </Link>
            </li>
            <li className="dashboard-nav__item">
              <Link href="/dashboard/reviews" className="dashboard-nav__link">
                My Reviews
              </Link>
            </li>

            {isBusiness && (
              <>
                <li className="dashboard-nav__item">
                  <Link href="/dashboard/submit-listing" className="dashboard-nav__link">
                    Submit Listing
                  </Link>
                </li>
                <li className="dashboard-nav__item">
                  <Link href="/dashboard/edit-listings" className="dashboard-nav__link">
                    Edit Listings
                  </Link>
                </li>
              </>
            )}

            <li className="dashboard-nav__item">
              <Link href="/logout" className="dashboard-nav__link dashboard-nav__link--signout">
                Sign Out
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard__content">
        {children}
      </main>
    </div>
  );
}
