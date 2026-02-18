import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/global.css";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const Dashboard = ({ token, user }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const accent = "#667eea";
  const accentGradient = "linear-gradient(135deg, #667eea, #764ba2)";

  if (loading)
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
  if (error)
    return (
      <div
        className="alert alert-error"
        style={{ maxWidth: 600, margin: "3rem auto" }}
      >
        {error}
      </div>
    );

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
          }}
        >
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
                }}
              >
                My Dashboard
              </p>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0 }}>
                Welcome, {profile?.name}!
              </h1>
              <p
                style={{
                  opacity: 0.8,
                  marginTop: "0.5rem",
                  fontSize: "0.95rem",
                }}
              >
                Keep contributing to earn more points and unlock rewards!
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
                Points
              </div>
            </div>
          </div>
        </div>

        {/* Stats + Profile Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          {/* Profile Card */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "1.75rem",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1.25rem",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  background: accentGradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                }}
              >
                {(profile?.name || "U")[0]}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: "#1a202c" }}>
                  {profile?.name}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#718096" }}>
                  {profile?.email}
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gap: "0.6rem" }}>
              {[
                ["📱", "Phone", profile?.phone || "—"],
                ["🏷️", "Role", profile?.role],
                [
                  "📍",
                  "Location",
                  `${profile?.location?.city || "—"}, ${profile?.location?.state || "—"}`,
                ],
                ["✅", "Status", "Active"],
              ].map(([icon, label, val]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 0",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <span style={{ fontSize: "0.9rem" }}>{icon}</span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "#a0aec0",
                      width: "70px",
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#2d3748",
                    }}
                  >
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            {[
              {
                icon: "📦",
                val: profile?.donationsMade?.length || 0,
                label: "Donated",
                color: accent,
              },
              {
                icon: "📥",
                val: profile?.donationsReceived?.length || 0,
                label: "Received",
                color: "#48bb78",
              },
              {
                icon: "🏅",
                val: profile?.certificates?.length || 0,
                label: "Certificates",
                color: "#ed8936",
              },
              {
                icon: "⭐",
                val: profile?.points || 0,
                label: "Points",
                color: "#9f7aea",
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: `${s.color}12`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    margin: "0 auto 0.75rem",
                  }}
                >
                  {s.icon}
                </div>
                <div
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 800,
                    color: s.color,
                  }}
                >
                  {s.val}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#718096",
                    fontWeight: 500,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates */}
        {profile?.certificates && profile.certificates.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#1a202c",
                marginBottom: "1rem",
              }}
            >
              🏆 Certificates Earned
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "1rem",
              }}
            >
              {profile.certificates.map((cert, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "white",
                    borderRadius: "14px",
                    padding: "1.25rem",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    borderLeft: `4px solid ${accent}`,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      background: `${accent}12`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.25rem",
                    }}
                  >
                    🏆
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: "#1a202c",
                        fontSize: "0.95rem",
                      }}
                    >
                      {cert.name}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#a0aec0" }}>
                      {new Date(cert.awardedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Donations */}
        {profile?.donationsMade && profile.donationsMade.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#1a202c",
                marginBottom: "1rem",
              }}
            >
              📦 My Donations
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {profile.donationsMade.map((donation, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "1rem 1.25rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderLeft: `4px solid ${accent}`,
                  }}
                >
                  <div style={{ fontWeight: 600, color: "#2d3748" }}>
                    {donation.title}
                  </div>
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      background: "#c6f6d5",
                      color: "#276749",
                    }}
                  >
                    {donation.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
