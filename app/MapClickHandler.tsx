'use client';

import { useMapEvents } from 'react-leaflet';

export default function MapClickHandler({ onNewMarker, canAddMarker }: any) {
  useMapEvents({
    click(e) {
      if (!canAddMarker) return;
      const marker = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        text: 'Новый маркер',
      };
      onNewMarker(marker);
    },
  });

  return null;
}
