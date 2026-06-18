import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand">ARETE FORGE</Link>
      <nav>
        <Link to="/map">Hazard Map</Link>
        {user?.role === 'user' && <Link to="/report">Submit Report</Link>}
        {user?.role === 'user' && <Link to="/my-reports">My Reports</Link>}
        {(user?.role === 'analyst' || user?.role === 'official') && (
          <Link to="/dashboard">Dashboard</Link>
        )}
        {user?.role === 'official' && <Link to="/alerts">Alerts</Link>}
        {user ? (
          <>
            <span>{user.name} ({user.role})</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
