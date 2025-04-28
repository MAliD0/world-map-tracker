'use client';

import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  geoJsonData: any;
  countryData: { [key: string]: { status: string; note?: string; value?: number } };
  onCountryClick: (countryName: string) => void;
  markColorPlanned: string;
  markColorVisited: string;
  markers: { lat: number; lng: number; text: string }[];
}

const MapView = ({
  geoJsonData,
  countryData,
  onCountryClick,
  markColorPlanned,
  markColorVisited,
  markers,
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
    </MapContainer>
  );
};

export default MapView;
