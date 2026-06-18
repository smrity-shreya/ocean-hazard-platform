import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Alerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [form, setForm] = useState({ title: '', message: '', lat: '', lng: '', radiusKm: 5, severity: 'yellow' });
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  function load() {
    api.get('/alerts').then((res) => setAlerts(res.data)).catch(() => {});
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setStatus('');
    try {
      await api.post('/alerts', {
        ...form,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
        radiusKm: parseFloat(form.radiusKm),
      });
      setStatus('Alert issued.');
      setForm({ title: '', message: '', lat: '', lng: '', radiusKm: 5, severity: 'yellow' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to issue alert');
    }
  }

  async function deactivate(id) {
    await api.patch(`/alerts/${id}/deactivate`);
    load();
  }

  return (
    <div className="container">
      {user?.role === 'official' && (
        <div className="card">
          <h2>Issue New Alert</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea required rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Latitude</label>
                <input required value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Longitude</label>
                <input required value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Radius (km)</label>
                <input value={form.radiusKm} onChange={(e) => setForm({ ...form, radiusKm: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Severity</label>
                <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
                  <option value="green">Green</option>
                  <option value="yellow">Yellow</option>
                  <option value="red">Red</option>
                </select>
              </div>
            </div>
            {error && <p className="error-text">{error}</p>}
            {status && <p style={{ color: '#5fe39b' }}>{status}</p>}
            <button className="btn" type="submit">Issue Alert</button>
          </form>
        </div>
      )}

      <div className="card">
        <h2>Active Alerts</h2>
        {alerts.length === 0 && <p>No active alerts.</p>}
        {alerts.map((a) => (
          <div key={a._id} className="card" style={{ background: '#0e1f30' }}>
            <span className={`badge ${a.severity === 'red' ? 'high' : a.severity === 'yellow' ? 'medium' : 'low'}`}>{a.severity}</span>
            <h3 style={{ margin: '8px 0' }}>{a.title}</h3>
            <p>{a.message}</p>
            <p style={{ color: '#9fb6c6', fontSize: '0.85rem' }}>
              Zone: {a.zone.lat.toFixed(3)}, {a.zone.lng.toFixed(3)} ({a.zone.radiusKm} km radius)
            </p>
            {user?.role === 'official' && (
              <button className="btn btn-outline" onClick={() => deactivate(a._id)}>Deactivate</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
