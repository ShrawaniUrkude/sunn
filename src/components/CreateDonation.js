import React, { useState } from "react";
import axios from "axios";
import "../styles/global.css";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const CreateDonation = ({ onSuccess, token }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "food",
    quantity: "",
    condition: "good",
    city: "",
    state: "",
    expiryDate: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        quantity: parseInt(formData.quantity),
        condition: formData.condition,
        location: { city: formData.city, state: formData.state },
        expiryDate: formData.expiryDate || null,
      };
      await axios.post(`${API_BASE_URL}/donations`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Donation created successfully!");
      setFormData({
        title: "",
        description: "",
        category: "food",
        quantity: "",
        condition: "good",
        city: "",
        state: "",
        expiryDate: "",
      });
      if (onSuccess) {
        setTimeout(onSuccess, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create donation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 70px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "linear-gradient(135deg, #f0f2f5 0%, #e8edf5 100%)",
      }}
    >
      <div style={{ maxWidth: "560px", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #48bb78, #38a169)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              margin: "0 auto 1rem",
              boxShadow: "0 8px 30px rgba(72,187,120,0.3)",
            }}
          >
            ➕
          </div>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#1a202c",
              marginBottom: "0.25rem",
            }}
          >
            Create Donation
          </h1>
          <p style={{ color: "#718096", fontSize: "0.95rem" }}>
            Share items with those in need
          </p>
        </div>
        <div className="card" style={{ padding: "2rem" }}>
          {error && <div className="alert alert-error">{error}</div>}
          {success && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                background: "#c6f6d5",
                color: "#276749",
                fontWeight: 600,
                marginBottom: "1rem",
                fontSize: "0.9rem",
              }}
            >
              {success}
            </div>
          )}
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
                className="form-input"
                placeholder="Describe the items being donated"
                rows="3"
                style={{ resize: "vertical" }}
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-input"
                  style={{ cursor: "pointer" }}
                >
                  <option value="food">🍞 Food</option>
                  <option value="clothes">👕 Clothes</option>
                  <option value="toys">🧸 Toys</option>
                  <option value="essentials">🏥 Essentials</option>
                  <option value="other">📦 Other</option>
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
                  placeholder="10"
                  required
                />
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div className="form-group">
                <label className="form-label">Condition</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="form-input"
                  style={{ cursor: "pointer" }}
                >
                  <option value="new">New</option>
                  <option value="good">Good</option>
                  <option value="used">Used</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Mumbai"
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
                  placeholder="Maharashtra"
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "1rem",
                background: "linear-gradient(135deg, #48bb78, #38a169)",
              }}
            >
              {loading ? "Creating..." : "➕ Create Donation"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDonation;
