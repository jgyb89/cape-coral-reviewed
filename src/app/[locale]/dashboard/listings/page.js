import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DeleteListingButton from '@/components/dashboard/DeleteListingButton';

export default async function MyListingsPage() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('authToken')?.value;

  if (!authToken) {
    redirect('/login');
  }

  const query = `
    query GetMyListings {
      viewer {
        roles { nodes { name } }
        ccrlistings {
          nodes {
            databaseId
            title
            slug
            date
          }
        }
      }
    }
  `;

  const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ query }),
    cache: 'no-store',
  });

  const json = await res.json();
  const viewer = json.data?.viewer;

  if (!viewer) {
    redirect('/login');
  }

  const roles = viewer.roles.nodes.map(r => r.name.toLowerCase());
  if (!roles.includes('business') && !roles.includes('administrator')) {
    redirect('/dashboard');
  }

  const listings = viewer.ccrlistings?.nodes || [];

  return (
    <div className="my-listings-page">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>My Listings</h1>
        <Link href="/submit-listing" className="listing-primary-btn" style={{ textDecoration: 'none' }}>
          <span className="material-symbols-outlined">add_business</span>
          Add New Listing
        </Link>
      </header>

      {listings.length === 0 ? (
        <div className="blank-state" style={{ textAlign: 'center', padding: '3rem', background: '#f9f9f9', borderRadius: '12px' }}>
          <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '1.5rem' }}>You haven't posted any listings yet.</p>
          <Link href="/submit-listing" style={{ color: '#e04c4c', fontWeight: '600' }}>Create your first listing now</Link>
        </div>
      ) : (
        <div className="listings-grid" style={{ display: 'grid', gap: '1.5rem' }}>
          {listings.map((listing) => (
            <div key={listing.databaseId} className="listing-item" style={{ 
              background: '#fff', 
              border: '1px solid #e2e8f0', 
              borderRadius: '12px', 
              padding: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{listing.title}</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                  Published on {new Date(listing.date).toLocaleDateString()}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Link href={`/directory/general/${listing.slug}`} style={{ color: '#e04c4c', fontWeight: '600', textDecoration: 'none', fontSize: '0.95rem' }}>
                  View
                </Link>
                <span style={{ color: '#e2e8f0' }}>|</span>
                <Link href={`/dashboard/listings/edit/${listing.databaseId}`} style={{ color: '#4a5568', fontWeight: '600', textDecoration: 'none', fontSize: '0.95rem' }}>
                  Edit
                </Link>
                <span style={{ color: '#e2e8f0' }}>|</span>
                <DeleteListingButton listingId={listing.databaseId} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
