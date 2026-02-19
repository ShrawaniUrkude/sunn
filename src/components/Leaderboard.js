import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/global.css";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/leaderboard`);
      setLeaderboard(response.data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    const map = {
      donor: { bg: "#667eea15", color: "#667eea", label: "Donor" },
      organisation: {
        bg: "#ed893615",
        color: "#ed8936",
        label: "Organisation",
      },
      volunteer: { bg: "#48bb7815", color: "#48bb78", label: "Volunteer" },
    };
    const r = map[role] || { bg: "#a0aec015", color: "#a0aec0", label: role };
    return (
      <span
        style={{
          padding: "4px 12px",
          borderRadius: "20px",
          fontSize: "0.75rem",
          fontWeight: 600,
          background: r.bg,
          color: r.color,
        }}
      >
        {r.label}
      </span>
    );
  };

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
            border: "4px solid #667eea22",
            borderTopColor: "#667eea",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        ></div>
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
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              margin: "0 auto 1rem",
              boxShadow: "0 8px 30px rgba(102,126,234,0.25)",
            }}
          >
            🏆
          </div>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#1a202c",
              marginBottom: "0.25rem",
            }}
          >
            Top Contributors
          </h1>
          <p style={{ color: "#718096", fontSize: "0.95rem" }}>
            Celebrating our most active community members
          </p>
        </div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            {[1, 0, 2].map((pos) => {
              const u = leaderboard[pos];
              const medals = ["🥇", "🥈", "🥉"];
              const heights = ["140px", "170px", "120px"];
              const gradients = [
                "linear-gradient(135deg, #a0aec0, #718096)",
                "linear-gradient(135deg, #f6e05e, #ecc94b)",
                "linear-gradient(135deg, #ed8936, #dd6b20)",
              ];
              return (
                <div
                  key={pos}
                  style={{ flex: 1, maxWidth: "180px", textAlign: "center" }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                    {medals[pos]}
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: "#1a202c",
                      fontSize: "0.9rem",
                      marginBottom: "0.25rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {u.organizationName || u.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#718096",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {u.points} pts
                  </div>
                  <div
                    style={{
                      height: heights[pos],
                      background: gradients[pos],
                      borderRadius: "12px 12px 0 0",
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "center",
                      paddingTop: "1rem",
                    }}
                  >
                    <span
                      style={{
                        color: "white",
                        fontWeight: 800,
                        fontSize: "1.5rem",
                      }}
                    >
                      #{pos + 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full List */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          {leaderboard.map((user, index) => (
            <div
              key={user._id}
              style={{
                background: "white",
                borderRadius: "14px",
                padding: "1rem 1.5rem",
                boxShadow:
                  index < 3
                    ? "0 4px 20px rgba(102,126,234,0.12)"
                    : "0 2px 8px rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                border: index < 3 ? "2px solid #667eea15" : "1px solid #f0f0f0",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateX(4px)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateX(0)";
                e.currentTarget.style.boxShadow =
                  index < 3
                    ? "0 4px 20px rgba(102,126,234,0.12)"
                    : "0 2px 8px rgba(0,0,0,0.04)";
              }}
            >
              <div
                style={{
                  width: "36px",
                  textAlign: "center",
                  fontSize: index < 3 ? "1.3rem" : "0.95rem",
                  fontWeight: 700,
                  color: index < 3 ? "#667eea" : "#a0aec0",
                }}
              >
                {index === 0
                  ? "🥇"
                  : index === 1
                    ? "🥈"
                    : index === 2
                      ? "🥉"
                      : `#${index + 1}`}
              </div>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  flexShrink: 0,
                }}
              >
                {(user.organizationName || user.name || "?")[0].toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 600,
                    color: "#1a202c",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user.organizationName || user.name}
                </div>
              </div>
              {getRoleBadge(user.role)}
              <div
                style={{
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  color: "#667eea",
                  minWidth: "60px",
                  textAlign: "right",
                }}
              >
                {user.points}
              </div>
            </div>
          ))}
        </div>

        {leaderboard.length === 0 && (
          <div
            style={{ textAlign: "center", padding: "3rem", color: "#a0aec0" }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏆</div>
            <p>No contributors yet. Be the first!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
