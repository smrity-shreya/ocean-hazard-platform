import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get('/reports', { params: filter ? { status: filter } : {} });
      setReports(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function updateStatus(id, status) {
    try {
      await api.patch(`/reports/${id}/status`, { status });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Analyst / Official Dashboard</h2>
        <div className="form-group" style={{ maxWidth: 240 }}>
          <label>Filter by status</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
            <option value="escalated">Escalated</option>
          </select>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && reports.length === 0 && <p>No reports found.</p>}

        {reports.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Reporter</th>
                <th>Type</th>
                <th>Description</th>
                <th>Severity</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r._id}>
                  <td>{r.reportedBy?.name || 'Unknown'}</td>
                  <td>{r.hazardType.replace(/_/g, ' ')}</td>
                  <td style={{ maxWidth: 240 }}>{r.description}</td>
                  <td><span className={`badge ${r.severity}`}>{r.severity}</span></td>
                  <td>{r.location.lat.toFixed(3)}, {r.location.lng.toFixed(3)}</td>
                  <td><span className={`badge ${r.status}`}>{r.status}</span></td>
                  <td>
                    <button className="btn btn-success" style={{ marginRight: 6, padding: '6px 10px' }} onClick={() => updateStatus(r._id, 'verified')}>Verify</button>
                    <button className="btn btn-danger" style={{ marginRight: 6, padding: '6px 10px' }} onClick={() => updateStatus(r._id, 'rejected')}>Reject</button>
                    <button className="btn btn-outline" style={{ padding: '6px 10px' }} onClick={() => updateStatus(r._id, 'escalated')}>Escalate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
