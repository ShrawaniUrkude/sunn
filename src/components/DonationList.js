import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/global.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const DonationList = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [token] = useState(localStorage.getItem('token'));

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/donations/available`);
      setDonations(response.data);
      setFilteredDonations(response.data);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category) {
      setFilteredDonations(donations.filter(d => d.category === category));
    } else {
      setFilteredDonations(donations);
    }
  }, [category, donations]);

  const handleClaim = async (donationId) => {
    if (!token) {
      alert('Please login to claim donations');
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/donations/${donationId}/claim`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Donation claimed successfully!');
      fetchDonations();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to claim donation');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      food: '#e74c3c',
      clothes: '#3498db',
      toys: '#f39c12',
      essentials: '#27ae60',
      other: '#95a5a6'
    };
    return colors[category] || '#95a5a6';
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <h1>Available Donations</h1>
      
      <div className="form-group">
        <label className="form-label">Filter by Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-select"
          style={{ maxWidth: '300px' }}
        >
          <option value="">All Categories</option>
          <option value="food">Food</option>
          <option value="clothes">Clothes</option>
          <option value="toys">Toys</option>
          <option value="essentials">Essentials</option>
          <option value="other">Other</option>
        </select>
      </div>

      {filteredDonations.length === 0 ? (
        <p>No donations available at the moment.</p>
      ) : (
        <div className="grid">
          {filteredDonations.map(donation => (
            <div key={donation._id} className="card">
              <div className="card-header">{donation.title}</div>
              <div className="card-body">
                <span
                  className="donation-category"
                  style={{ backgroundColor: getCategoryColor(donation.category) + '30', color: getCategoryColor(donation.category) }}
                >
                  {donation.category.toUpperCase()}
                </span>
                <p>{donation.description}</p>
                <div className="donation-info">
                  <div className="donation-info-item">
                    <div className="donation-info-label">Quantity</div>
                    <div className="donation-info-value">{donation.quantity}</div>
                  </div>
                  <div className="donation-info-item">
                    <div className="donation-info-label">Condition</div>
                    <div className="donation-info-value">{donation.condition}</div>
                  </div>
                </div>
                {donation.expiryDate && (
                  <div className="donation-info-item">
                    <div className="donation-info-label">Expiry Date</div>
                    <div className="donation-info-value">
                      {new Date(donation.expiryDate).toLocaleDateString()}
                    </div>
                  </div>
                )}
                {donation.donor && (
                  <div className="donation-info-item">
                    <div className="donation-info-label">Donor</div>
                    <div className="donation-info-value">{donation.donor.name}</div>
                  </div>
                )}
                <div style={{ marginTop: '1rem' }}>
                  <span className="badge badge-success">{donation.status}</span>
                </div>
              </div>
              <div className="card-footer">
                <button
                  className="btn btn-primary"
                  onClick={() => handleClaim(donation._id)}
                >
                  Claim Donation
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationList;
