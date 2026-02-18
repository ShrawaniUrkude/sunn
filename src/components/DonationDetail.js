import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/global.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const DonationDetail = ({ donationId, token, onClose }) => {
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [peopleHelped, setPeopleHelped] = useState(1);
  const [distributing, setDistributing] = useState(false);

  useEffect(() => {
    fetchDonationDetail();
  }, [donationId]);

  const fetchDonationDetail = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/donations/${donationId}`);
      setDonation(response.data);
    } catch (error) {
      console.error('Error fetching donation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDistribute = async () => {
    if (!recipientEmail) {
      alert('Please enter recipient email');
      return;
    }

    setDistributing(true);
    try {
      // In a real app, you would look up the recipient by email
      // For now, we'll use a placeholder ID
      await axios.post(
        `${API_BASE_URL}/donations/${donationId}/distribute`,
        {
          recipientId: 'recipient-id', // This should be dynamic
          peopleHelped: parseInt(peopleHelped)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Donation distributed successfully!');
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to distribute donation');
    } finally {
      setDistributing(false);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (!donation) {
    return <div className="alert alert-error">Donation not found</div>;
  }

  return (
    <div className="card" style={{ maxWidth: '600px' }}>
      <div className="card-header">{donation.title}</div>
      <div className="card-body">
        <div className="donation-info">
          <div className="donation-info-item">
            <div className="donation-info-label">Category</div>
            <div className="donation-info-value">{donation.category}</div>
          </div>
          <div className="donation-info-item">
            <div className="donation-info-label">Quantity</div>
            <div className="donation-info-value">{donation.quantity}</div>
          </div>
          <div className="donation-info-item">
            <div className="donation-info-label">Condition</div>
            <div className="donation-info-value">{donation.condition}</div>
          </div>
        </div>

        <p><strong>Description:</strong> {donation.description}</p>

        {donation.donor && (
          <div>
            <p><strong>Donor:</strong> {donation.donor.name}</p>
            <p><strong>Contact:</strong> {donation.donor.phone}</p>
          </div>
        )}

        <p><strong>Status:</strong> <span className="badge badge-success">{donation.status}</span></p>

        {donation.status === 'claimed' && token && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f0f7ff', borderRadius: '4px' }}>
            <h3>Mark as Distributed</h3>
            <div className="form-group">
              <label className="form-label">Recipient Email</label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="form-input"
                placeholder="recipient@example.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Number of People Helped</label>
              <input
                type="number"
                value={peopleHelped}
                onChange={(e) => setPeopleHelped(e.target.value)}
                className="form-input"
                min="1"
              />
            </div>
            <button
              onClick={handleDistribute}
              className="btn btn-success"
              disabled={distributing}
            >
              {distributing ? 'Distributing...' : 'Confirm Distribution'}
            </button>
          </div>
        )}
      </div>
      <div className="card-footer">
        <button onClick={onClose} className="btn btn-secondary">
          Close
        </button>
      </div>
    </div>
  );
};

export default DonationDetail;
