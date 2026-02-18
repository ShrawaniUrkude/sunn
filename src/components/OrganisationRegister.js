import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const OrganisationRegister = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    state: "",
    orgType: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: "organisation",
        orgType: formData.orgType,
        location: { city: formData.city, state: formData.state },
      };
      const response = await axios.post(
        `${API_BASE_URL}/users/register`,
        payload,
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      if (rememberMe)
        localStorage.setItem("rememberedEmail_organisation", formData.email);
      onSuccess();
      navigate("/organisation-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
        background: "linear-gradient(135deg, #fef6ee 0%, #fef0e4 100%)",
      }}
    >
      <div style={{ maxWidth: "480px", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #ed8936, #dd6b20)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              margin: "0 auto 1rem",
              boxShadow: "0 8px 30px rgba(237,137,54,0.3)",
            }}
          >
            🏢
          </div>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#1a202c",
              marginBottom: "0.25rem",
            }}
          >
            Register Organisation
          </h1>
          <p style={{ color: "#718096", fontSize: "0.95rem" }}>
            Manage and distribute donations effectively.
          </p>
        </div>
        <div className="card" style={{ padding: "2rem" }}>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Organisation Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="My Charity Org"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="org@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Create a strong password"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                placeholder="+91 98765 43210"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Organisation Type</label>
              <select
                name="orgType"
                value={formData.orgType}
                onChange={handleChange}
                className="form-input"
                required
                style={{ cursor: "pointer" }}
              >
                <option value="">Select Type</option>
                <option value="ngo">NGO</option>
                <option value="trust">Trust</option>
                <option value="college-club">College Club</option>
                <option value="community">Community Group</option>
                <option value="other">Other</option>
              </select>
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "0.75rem 0 1.25rem",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  color: "#4a5568",
                  userSelect: "none",
                }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    width: "16px",
                    height: "16px",
                    accentColor: "#ed8936",
                    cursor: "pointer",
                  }}
                />
                Remember me
              </label>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "1rem",
                background: "linear-gradient(135deg, #ed8936, #dd6b20)",
              }}
            >
              {loading ? "Creating account..." : "Create Organisation"}
            </button>
          </form>
        </div>
        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            color: "#718096",
            fontSize: "0.9rem",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/organisation-login"
            style={{
              color: "#ed8936",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default OrganisationRegister;
