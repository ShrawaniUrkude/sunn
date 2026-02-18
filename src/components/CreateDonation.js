import React, { useState } from 'react';
import axios from 'axios';
import '../styles/global.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CreateDonation = ({ onSuccess, token }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'food',
    quantity: '',
    condition: 'good',
    city: '',
    state: '',
    expiryDate: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        quantity: parseInt(formData.quantity),
        condition: formData.condition,
        location: {
          city: formData.city,
          state: formData.state
        },
        expiryDate: formData.expiryDate || null
      };

      await axios.post(`${API_BASE_URL}/donations`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Donation created successfully!');
      setFormData({
        title: '',
        description: '',
        category: 'food',
        quantity: '',
        condition: 'good',
        city: '',
        state: '',
        expiryDate: ''
      });

      if (onSuccess) {
        setTimeout(onSuccess, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <div className="card-header">Create New Donation</div>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., Fresh Vegetables"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Describe the items being donated"
          />
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
            >
              <option value="food">Food</option>
              <option value="clothes">Clothes</option>
              <option value="toys">Toys</option>
              <option value="essentials">Essentials</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Condition</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="form-select"
            >
              <option value="new">New</option>
              <option value="good">Good</option>
              <option value="used">Used</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Expiry Date (if applicable)</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? 'Creating...' : 'Create Donation'}
        </button>
      </form>
    </div>
  );
};

export default CreateDonation;
