import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const OrganisationLogin = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(
    () => !!localStorage.getItem("rememberedEmail_organisation"),
  );
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("rememberedEmail_organisation");
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
      if (user.role !== "organisation") {
        setError("This login is for organisations only.");
        setLoading(false);
        return;
      }
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(user));
      if (rememberMe)
        localStorage.setItem("rememberedEmail_organisation", formData.email);
      else localStorage.removeItem("rememberedEmail_organisation");
      onSuccess();
      navigate("/organisation-dashboard");
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
        background: "linear-gradient(135deg, #f0f2f5 0%, #fef5e7 100%)",
      }}
    >
      <div style={{ maxWidth: "440px", width: "100%" }}>
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
            Organisation Login
          </h1>
          <p style={{ color: "#718096", fontSize: "0.95rem" }}>
            Sign in to manage your organisation.
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
                    accentColor: "#ed8936",
                    cursor: "pointer",
                  }}
                />
                Remember me
              </label>
            </div>
            <button
              type="submit"
              className="btn"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "1rem",
                background: "linear-gradient(135deg, #ed8936, #dd6b20)",
                color: "white",
                boxShadow: "0 4px 15px rgba(237,137,54,0.4)",
              }}
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
            to="/organisation-register"
            style={{
              color: "#ed8936",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default OrganisationLogin;
