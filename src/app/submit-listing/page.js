import React from 'react';
import ListingWizard from '@/components/directory-builder/ListingWizard';

export default async function SubmitListingPage() {
  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5rem', fontWeight: 'bold' }}>
        Submit Your Business
      </h1>
      <ListingWizard />
    </main>
  );
}
