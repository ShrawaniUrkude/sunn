import React from 'react';
import '../styles/global.css';

const Home = ({ user }) => {
  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2c3e50', marginBottom: '1rem' }}>
          ♥ Donation Platform
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#7f8c8d' }}>
          Connect donors, volunteers, and communities to create a positive impact
        </p>
      </div>

      <div className="grid">
        <div className="card">
          <div className="card-header">🎁 For Donors</div>
          <div className="card-body">
            <p>Share your excess food, clothes, toys, and essentials with communities in need. Track your donations and see the impact you're making.</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">👥 For Volunteers</div>
          <div className="card-body">
            <p>Help distribute donations to those in need. Earn points, certificates, and recognition for your contribution to society.</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">📍 Location-Based</div>
          <div className="card-body">
            <p>Find donations and volunteers near you. Our location-based system ensures efficient coordination and quick distribution.</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">🏆 Rewards & Recognition</div>
          <div className="card-body">
            <p>Earn points for every donation and volunteer activity. Unlock certificates and appreciation from the community.</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">📊 Track Impact</div>
          <div className="card-body">
            <p>See detailed statistics about donations made, people helped, and the overall impact of the donation network.</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">🤝 Community Driven</div>
          <div className="card-body">
            <p>Connect local businesses, college clubs, and community members. Together, we build a stronger, more compassionate society.</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '4rem', padding: '2rem', backgroundColor: '#ecf0f1', borderRadius: '8px', textAlign: 'center' }}>
        <h2>Get Started Today</h2>
        <p>Join our community and make a difference. Whether you have items to donate or want to volunteer, we have a place for you.</p>
        {!user && (
          <div>
            <a href="/register" className="btn btn-primary" style={{ marginRight: '1rem' }}>
              Create Account
            </a>
            <a href="/login" className="btn btn-secondary">
              Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
