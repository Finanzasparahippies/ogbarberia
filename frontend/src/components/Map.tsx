'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon in Leaflet + Next.js
const icon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapProps {
  center: [number, number];
  zoom?: number;
}

const Map = ({ center, zoom = 15 }: MapProps) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      // Dark mode for map (optional, using grayscale filter)
      />
      <Marker position={center} icon={icon}>
        <Popup>
          <div className="text-black font-bold">OG Barbería</div>
          <div className="text-gray-600 text-xs">Blvd Lopez Portillo #72 entre calle dos y calle tres</div>
          <div className="text-gray-600 text-xs">Col. Mision del Sol, Hermosillo, Sonora</div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
