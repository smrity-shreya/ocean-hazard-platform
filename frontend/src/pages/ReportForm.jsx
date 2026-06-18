import React, { useState } from 'react';
import api from '../api/axios';

const HAZARD_TYPES = [
  'flooding',
  'high_waves',
  'unusual_sea_activity',
  'oil_spill',
  'stranded_animal',
  'erosion',
  'other',
];

export default function ReportForm() {
  const [form, setForm] = useState({
    hazardType: 'flooding',
    description: '',
    severity: 'medium',
    lat: '',
    lng: '',
    placeName: '',
  });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by this browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6),
        }));
      },
      () => setError('Could not fetch location. Enter manually.')
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setStatus('');
    if (!form.lat || !form.lng) {
      setError('Location (lat/lng) is required.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/reports', {
        ...form,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
      });
      setStatus('Report submitted successfully. Thank you!');
      setForm({ hazardType: 'flooding', description: '', severity: 'medium', lat: '', lng: '', placeName: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 560 }}>
      <div className="card">
        <h2>Report an Ocean Hazard</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Hazard Type</label>
            <select
              value={form.hazardType}
              onChange={(e) => setForm({ ...form, hazardType: e.target.value })}
            >
              {HAZARD_TYPES.map((t) => (
                <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Severity (your assessment)</label>
            <select
              value={form.severity}
              onChange={(e) => setForm({ ...form, severity: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Place name (optional)</label>
            <input
              value={form.placeName}
              onChange={(e) => setForm({ ...form, placeName: e.target.value })}
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Latitude</label>
              <input
                required
                value={form.lat}
                onChange={(e) => setForm({ ...form, lat: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Longitude</label>
              <input
                required
                value={form.lng}
                onChange={(e) => setForm({ ...form, lng: e.target.value })}
              />
            </div>
          </div>
          <button type="button" className="btn btn-outline" onClick={useMyLocation} style={{ marginBottom: 14 }}>
            Use My Current Location
          </button>

          {error && <p className="error-text">{error}</p>}
          {status && <p style={{ color: '#5fe39b' }}>{status}</p>}

          <div>
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
