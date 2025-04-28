// MapView.tsx (обновлённый)
'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Прямо задаём путь к иконке через URL
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapClickHandler from './MapClickHandler'; // убедитесь, что путь правильный


interface MapViewProps {
  
  geoJsonData: any;
  countryData: { [key: string]: { status: string; note?: string; value?: number } };
  onCountryClick: (countryName: string) => void;
  markColorPlanned: string;
  markColorVisited: string;
  markers: { lat: number; lng: number; text: string }[];
  onNewMarker: (marker: { lat: number; lng: number; text: string }) => void;
}

const MapView = ({
  geoJsonData,
  countryData,
  onCountryClick,
  markColorPlanned,
  markColorVisited,
  markers,
  onNewMarker,
}: MapViewProps) => {
  const styleCountry = (feature: any) => {
    const name = feature.properties.name;
    const data = countryData?.[name];
    let fillColor = '#ddd'; // Цвет по умолчанию

    if (data) {
      if (data.status === 'planned') {
        fillColor = markColorPlanned;
      } else if (data.status === 'visited') {
        fillColor = markColorVisited;
      }
    }

    return {
      fillColor,
      weight: 1,
      color: '#000',
      fillOpacity: 0.3,
    };
  };

  return (
    <MapContainer
      style={{ width: '100%', height: '100%' }}
      center={[20, 0]}
      zoom={3}
      minZoom={3}
      scrollWheelZoom
      maxBounds={[
        [-85, -180],
        [85, 180],
      ]}
      maxBoundsViscosity={1.0}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        noWrap={true}
      />
      {geoJsonData && (
        <GeoJSON
          data={geoJsonData}
          style={styleCountry}
          onEachFeature={(feature, layer) => {
            const name = feature.properties.name;
            layer.on('click', () => onCountryClick(name));
          }}
        />
      )}
      {markers.map((marker, index) => (
        <Marker key={index} position={{ lat: marker.lat, lng: marker.lng }}>
          <Popup>{marker.text}</Popup>
        </Marker>
      ))}
      {/* MapClickHandler теперь рендерится как потомок MapContainer */}
      <MapClickHandler onNewMarker={onNewMarker} />
    </MapContainer>
  );
};

export default MapView;
