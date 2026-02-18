import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const VolunteerLogin = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(
    () => !!localStorage.getItem("rememberedEmail_volunteer"),
  );
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("rememberedEmail_volunteer");
    if (saved) setFormData((prev) => ({ ...prev, email: saved }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/login`,
        formData,
      );
      const user = response.data.user;
      if (user.role !== "volunteer") {
        setError("This login is for volunteers only.");
        setLoading(false);
        return;
      }
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(user));
      if (rememberMe)
        localStorage.setItem("rememberedEmail_volunteer", formData.email);
      else localStorage.removeItem("rememberedEmail_volunteer");
      onSuccess();
      navigate("/volunteer-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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
        background: "linear-gradient(135deg, #f0f2f5 0%, #eafaf1 100%)",
      }}
    >
      <div style={{ maxWidth: "440px", width: "100%" }}>
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
            👥
          </div>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#1a202c",
              marginBottom: "0.25rem",
            }}
          >
            Volunteer Login
          </h1>
          <p style={{ color: "#718096", fontSize: "0.95rem" }}>
            Sign in to start helping your community.
          </p>
        </div>
        <div className="card" style={{ padding: "2rem" }}>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="you@example.com"
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
                placeholder="Enter your password"
                required
              />
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
                    accentColor: "#48bb78",
                    cursor: "pointer",
                  }}
                />
                Remember me
              </label>
            </div>
            <button
              type="submit"
              className="btn btn-success"
              disabled={loading}
              style={{ width: "100%", padding: "14px", fontSize: "1rem" }}
            >
              {loading ? "Signing in..." : "Sign In"}
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
          Don't have an account?{" "}
          <Link
            to="/volunteer-register"
            style={{
              color: "#48bb78",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Join as Volunteer
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VolunteerLogin;
