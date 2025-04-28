'use client';

import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapClickHandler from './MapClickHandler';

const MapView = ({
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
  const styleCountry = (feature: any) => {
    const name = feature.properties.name;
    const data = countryData?.[name];
    let fillColor = '#ddd';

    if (data) {
      fillColor = data.status === 'visited' ? '#008000' : '#FF0000';
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
      <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" noWrap={true} />
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
      {markers.map((marker: any, index: number) => (
        <Marker
          key={index}
          position={{ lat: marker.lat, lng: marker.lng }}
          icon={L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="
              background-color: #6C63FF;
              color: white;
              border-radius: 8px;
              padding: 2px 2px;
              font-size: 12px;
              text-align: center;
            ">${"X"}</div>`,
            iconSize: [50, 50],
            iconAnchor: [25, 25],
          })}
          eventHandlers={{
            click: () => onMarkerClick(marker),
          }}
        >
          <Popup>
            {selectedMarker && marker.lat === selectedMarker.lat && marker.lng === selectedMarker.lng ? (
              <input style={{ color: 'black' }} 
                type="text"
                defaultValue={marker.text}
                onBlur={(e) => onUpdateMarkerText(e.target.value)}
              />
            ) : (
              marker.text
            )}
          </Popup>
        </Marker>
      ))}
      <MapClickHandler onNewMarker={onNewMarker} canAddMarker={canAddMarker} />
    </MapContainer>
  );
};

export default MapView;
