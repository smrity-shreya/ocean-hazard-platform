import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ReportForm from './pages/ReportForm';
import MyReports from './pages/MyReports';
import Dashboard from './pages/Dashboard';
import HazardMap from './pages/HazardMap';
import Alerts from './pages/Alerts';

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/map" element={<HazardMap />} />

        <Route
          path="/report"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <ReportForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-reports"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <MyReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['analyst', 'official']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alerts"
          element={
            <ProtectedRoute allowedRoles={['user', 'analyst', 'official']}>
              <Alerts />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
