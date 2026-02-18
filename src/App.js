import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Register from './components/Register';
import Login from './components/Login';
import Home from './pages/Home';
import DonationList from './components/DonationList';
import CreateDonation from './components/CreateDonation';
import Dashboard from './components/Dashboard';
import Leaderboard from './components/Leaderboard';
import './styles/global.css';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleLoginSuccess = () => {
    const savedUser = localStorage.getItem('user');
    setUser(savedUser ? JSON.parse(savedUser) : null);
  };

  return (
    <Router>
      <Navigation user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/register" element={<Register onSuccess={handleLoginSuccess} />} />
        <Route path="/login" element={<Login onSuccess={handleLoginSuccess} />} />
        <Route path="/donations" element={<DonationList />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route
          path="/create-donation"
          element={user?.role === 'donor' ? <CreateDonation token={token} /> : <Navigate to="/" />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard token={token} user={user} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
