import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/global.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Dashboard = ({ token, user }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div className="container" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <h1>My Dashboard</h1>

      {/* Points Section */}
      <div className="points-container">
        <h2>Your Points</h2>
        <div className="points-value">{profile?.points || 0}</div>
        <p>Keep contributing to earn more points and unlock rewards!</p>
      </div>

      {/* Profile Section */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">Profile Information</div>
          <div className="card-body">
            <p><strong>Name:</strong> {profile?.name}</p>
            <p><strong>Email:</strong> {profile?.email}</p>
            <p><strong>Phone:</strong> {profile?.phone || '-'}</p>
            <p><strong>Role:</strong> <span className="badge badge-info">{profile?.role}</span></p>
            <p><strong>Location:</strong> {profile?.location?.city}, {profile?.location?.state}</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="card">
          <div className="card-header">Statistics</div>
          <div className="card-body">
            <p><strong>Donations Made:</strong> {profile?.donationsMade?.length || 0}</p>
            <p><strong>Donations Received:</strong> {profile?.donationsReceived?.length || 0}</p>
            <p><strong>Certificates Earned:</strong> {profile?.certificates?.length || 0}</p>
            <p><strong>Account Status:</strong> <span className="badge badge-success">Active</span></p>
          </div>
        </div>
      </div>

      {/* Certificates Section */}
      {profile?.certificates && profile.certificates.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Certificates Earned</h2>
          <div className="grid">
            {profile.certificates.map((cert, idx) => (
              <div key={idx} className="certificate-item">
                <div className="certificate-title">🏆 {cert.name}</div>
                <div className="certificate-date">
                  {new Date(cert.awardedDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Donations Made */}
      {profile?.donationsMade && profile.donationsMade.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>My Donations</h2>
          {profile.donationsMade.map((donation, idx) => (
            <div key={idx} className="donation-item">
              <div className="donation-title">{donation.title}</div>
              <span className="badge badge-success">{donation.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
