// MapClickHandler.tsx
'use client';

import { useMapEvents } from 'react-leaflet';
import { LatLngLiteral } from 'leaflet';

export interface MarkerData {
  lat: number;
  lng: number;
  text: string;
}

interface MapClickHandlerProps {
  onNewMarker: (marker: MarkerData) => void;
}

export default function MapClickHandler({ onNewMarker }: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      const marker = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        text: 'Новый маркер', // пока задаем дефолтный текст
      };
      console.log('[MapClickHandler] Клик по карте:', marker);
      onNewMarker(marker);
    },
  });

  return null;
}
