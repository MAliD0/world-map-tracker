// MapViewClientWrapper.tsx (обновлённый)
'use client';

import dynamic from 'next/dynamic';

// Динамически импортируем компонент MapView
const MapView = dynamic(() => import('@/app/MapView'), { ssr: false });

interface MapViewClientWrapperProps {
  geoJsonData: any;
  countryData: any;
  onCountryClick: (countryName: string) => void;
  markColorPlanned: string;
  markColorVisited: string;
  markers: { lat: number; lng: number; text: string }[];
  onNewMarker: (marker: { lat: number; lng: number; text: string }) => void;
}

const MapViewClientWrapper = ({
  geoJsonData,
  countryData,
  onCountryClick,
  markColorPlanned,
  markColorVisited,
  markers,
  onNewMarker,
}: MapViewClientWrapperProps) => {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapView
        geoJsonData={geoJsonData}
        countryData={countryData}
        onCountryClick={onCountryClick}
        markColorPlanned={markColorPlanned}
        markColorVisited={markColorVisited}
        markers={markers}
        onNewMarker={onNewMarker}
      />
    </div>
  );
};

export default MapViewClientWrapper;
