import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/global.css';

const Navigation = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          ♥ Donation Platform
        </Link>
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/donations">Browse Donations</Link></li>
          <li><Link to="/leaderboard">Leaderboard</Link></li>
          {user ? (
            <>
              {user.role === 'donor' && <li><Link to="/create-donation">Create Donation</Link></li>}
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><a href="#logout" onClick={onLogout}>Logout</a></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
