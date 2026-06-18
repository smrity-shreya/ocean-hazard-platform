import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../api/axios';

// Default Leaflet marker icons (CDN) since bundlers often break the default asset path
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const ZONE_COLOR = { green: '#27ae60', yellow: '#f1c40f', red: '#e74c3c' };

export default function HazardMap() {
  const [zones, setZones] = useState([]);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const center = [13.0827, 80.2707]; // default center: Chennai coast

  useEffect(() => {
    Promise.all([api.get('/reports/zones'), api.get('/reports').catch(() => ({ data: [] }))])
      .then(([zoneRes, reportRes]) => {
        setZones(zoneRes.data);
        setReports(reportRes.data);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load map data'));
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h2>Live Hazard Risk Map</h2>
        <p style={{ color: '#9fb6c6' }}>
          Zones are computed from reports in the last 24 hours, weighted by severity and recency.
        </p>
        {error && <p className="error-text">{error}</p>}
        <MapContainer id="hazard-map" center={center} zoom={9} scrollWheelZoom>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {zones.map((zone, i) => (
            <CircleMarker
              key={i}
              center={[zone.lat, zone.lng]}
              radius={14}
              pathOptions={{
                color: ZONE_COLOR[zone.zoneColor],
                fillColor: ZONE_COLOR[zone.zoneColor],
                fillOpacity: 0.45,
              }}
            >
              <Popup>
                Risk: <strong>{zone.zoneColor.toUpperCase()}</strong><br />
                Score: {zone.score}<br />
                Reports: {zone.reportCount}
              </Popup>
            </CircleMarker>
          ))}
          {reports.map((r) => (
            <Marker key={r._id} position={[r.location.lat, r.location.lng]} icon={defaultIcon}>
              <Popup>
                <strong>{r.hazardType.replace(/_/g, ' ')}</strong><br />
                {r.description}<br />
                Severity: {r.severity} | Status: {r.status}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
