import React from 'react';
import { getDictionary } from '@/lib/dictionaries';
import LoginModal from '@/components/auth/LoginModal';

export default async function LoginPage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <main style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{ 
        maxWidth: '500px', 
        padding: '40px', 
        backgroundColor: '#fff', 
        borderRadius: '12px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        border: '1px solid #f1f5f9'
      }}>
        <div className="material-symbols-outlined" style={{ fontSize: '4rem', color: '#e04c4c', marginBottom: '1.5rem' }}>
          lock_clock
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem' }}>
          Session Expired
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
          Your session has expired or you are not logged in. Please sign in again to access your dashboard and manage your listings.
        </p>
        
        {/* We use a Client Component trigger here or just link to our standard login flow */}
        {/* For this prototype, we'll suggest using the Login button in the Navbar or provide a direct trigger if LoginModal can be standalone */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a 
            href={`/${locale}`}
            style={{ 
              padding: '0.75rem 2rem', 
              borderRadius: '8px', 
              border: '1px solid #e2e8f0', 
              textDecoration: 'none',
              color: '#475569',
              fontWeight: '600'
            }}
          >
            Go Home
          </a>
          <button 
            className="listing-primary-btn"
            style={{ 
              padding: '0.75rem 2rem',
              border: 'none'
            }}
            onClick={() => {/* Trigger Login Logic */}}
          >
            Log In
          </button>
        </div>
      </div>
      
      {/* Since we can't easily trigger the Navbar's modal from here without more complex state, 
          we can render a dedicated Login page variant or a standalone LoginModal trigger */}
      <p style={{ marginTop: '2rem', color: '#94a3b8', fontSize: '0.9rem' }}>
        Cape Coral Reviewed &copy; {new Date().getFullYear()}
      </p>
    </main>
  );
}
