'use client';

import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/app/MapView'), { ssr: false });

const MapViewClientWrapper = ({
  geoJsonData,
  countryData,
  onCountryClick,
  markers,
  onNewMarker,
  canAddMarker,
  onMarkerClick,
  onUpdateMarkerText,
  selectedMarker,
}: any) => {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapView
        geoJsonData={geoJsonData}
        countryData={countryData}
        onCountryClick={onCountryClick}
        markers={markers}
        onNewMarker={onNewMarker}
        canAddMarker={canAddMarker}
        onMarkerClick={onMarkerClick}
        onUpdateMarkerText={onUpdateMarkerText}
        selectedMarker={selectedMarker}
      />
    </div>
  );
};

export default MapViewClientWrapper;
