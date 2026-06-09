"use client";

import React, { memo } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '12px',
};

const libraries = ['places'];

function EventMap({ lat, lng, address }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (!lat || !lng) return null;

  const center = { lat: parseFloat(lat), lng: parseFloat(lng) };

  return isLoaded ? (
    <div style={{ marginTop: '2.5rem' }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: '700' }}>Location</h3>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        <Marker position={center} title={address} />
      </GoogleMap>
    </div>
  ) : (
    <div style={{ marginTop: '2.5rem' }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: '700' }}>Location</h3>
      <div style={{ height: '400px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '12px' }} />
    </div>
  );
}

export default memo(EventMap);
