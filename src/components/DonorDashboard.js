import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const DonorDashboard = ({ token, user }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (err) {
        setError("Failed to load profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const accent = "#667eea";
  const accentGradient = "linear-gradient(135deg, #667eea, #5a67d8)";
  // Category color and emoji map
  const categoryMap = {
    food: { color: "#48bb78", bg: "#e6fffa", icon: "🍞" },
    clothes: { color: "#667eea", bg: "#ebf4ff", icon: "👕" },
    toys: { color: "#ed8936", bg: "#fff5eb", icon: "🧸" },
    essentials: { color: "#fc5c65", bg: "#fff5f7", icon: "🏥" },
    other: { color: "#764ba2", bg: "#f3e8ff", icon: "📦" },
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            border: `4px solid ${accent}22`,
            borderTopColor: accent,
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="alert alert-error"
        style={{ maxWidth: 600, margin: "3rem auto" }}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 70px)",
        background: "#f7f8fc",
        padding: "2rem 0",
      }}
    >
      <div
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem" }}
      >
        {/* Hero Banner */}
        <div
          style={{
            background: accentGradient,
            borderRadius: "20px",
            padding: "2.5rem",
            marginBottom: "2rem",
            color: "white",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            gap: "2.5rem",
          }}
        >
          {/* Dashboard Logo */}
          <div
            style={{
              minWidth: 90,
              minHeight: 90,
              width: 90,
              height: 90,
              borderRadius: 24,
              background: "rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
              fontWeight: 900,
              boxShadow: "0 8px 32px rgba(102,126,234,0.18)",
              marginRight: 24,
            }}
          >
            <span role="img" aria-label="Donor">
              ❤️
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                position: "absolute",
                top: "-30px",
                right: "-30px",
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                bottom: "-20px",
                right: "80px",
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.08)",
              }}
            ></div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem",
                position: "relative",
                zIndex: 1,
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "0.9rem",
                    opacity: 0.85,
                    marginBottom: "0.25rem",
                    letterSpacing: 1,
                  }}
                >
                  Welcome back,
                </p>
                <h1
                  style={{
                    fontSize: "2rem",
                    fontWeight: 900,
                    margin: 0,
                    letterSpacing: 1,
                  }}
                >
                  {profile?.name || user?.name}
                </h1>
                <p
                  style={{
                    opacity: 0.8,
                    marginTop: "0.5rem",
                    fontSize: "0.95rem",
                  }}
                >
                  Every donation counts! Keep sharing to earn more points.
                </p>
              </div>
              <div
                style={{
                  textAlign: "center",
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  padding: "1.25rem 2rem",
                }}
              >
                <div
                  style={{ fontSize: "2.5rem", fontWeight: 900, lineHeight: 1 }}
                >
                  {profile?.points || 0}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    opacity: 0.85,
                    marginTop: "0.25rem",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Donor Points
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ...rest of the dashboard code remains unchanged... */}
      </div>
    </div>
  );
};

export default DonorDashboard;
