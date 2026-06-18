import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/reports/mine')
      .then((res) => setReports(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load reports'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h2>My Submitted Reports</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && reports.length === 0 && <p>You haven't submitted any reports yet.</p>}
        {reports.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r._id}>
                  <td>{r.hazardType.replace(/_/g, ' ')}</td>
                  <td>{r.description}</td>
                  <td><span className={`badge ${r.severity}`}>{r.severity}</span></td>
                  <td><span className={`badge ${r.status}`}>{r.status}</span></td>
                  <td>{new Date(r.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
