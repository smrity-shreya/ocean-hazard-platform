import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="container">
      <div className="card">
        <h1>ARETE FORGE</h1>
        <p>Crowdsourced ocean hazard reporting platform — report, verify, and visualize coastal hazards in real time.</p>
        {user ? (
          <p>Welcome back, <strong>{user.name}</strong>. Use the navigation above to {user.role === 'user' ? 'submit a hazard report or view the map' : 'review reports on your dashboard'}.</p>
        ) : (
          <p>Please login or register to get started.</p>
        )}
      </div>
    </div>
  );
}
