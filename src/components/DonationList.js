import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/global.css";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const DonationList = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [token] = useState(localStorage.getItem("token"));

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/donations/available`);
      setDonations(response.data);
      setFilteredDonations(response.data);
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category) {
      setFilteredDonations(donations.filter((d) => d.category === category));
    } else {
      setFilteredDonations(donations);
    }
  }, [category, donations]);

  const handleClaim = async (donationId) => {
    if (!token) {
      alert("Please login to claim donations");
      return;
    }
    try {
      await axios.post(
        `${API_BASE_URL}/donations/${donationId}/claim`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("Donation claimed successfully!");
      fetchDonations();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to claim donation");
    }
  };

  const getCategoryStyle = (cat) => {
    const map = {
      food: { bg: "#fed7d7", color: "#c53030", icon: "🍞" },
      clothes: { bg: "#bee3f8", color: "#2b6cb0", icon: "👕" },
      toys: { bg: "#fefcbf", color: "#975a16", icon: "🧸" },
      essentials: { bg: "#c6f6d5", color: "#276749", icon: "🏥" },
      other: { bg: "#e2e8f0", color: "#4a5568", icon: "📦" },
    };
    return map[cat] || map.other;
  };

  const categories = ["food", "clothes", "toys", "essentials", "other"];

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
      <div
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem" }}
      >
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#1a202c",
              marginBottom: "0.25rem",
            }}
          >
            📦 Available Donations
          </h1>
          <p style={{ color: "#718096", fontSize: "0.95rem" }}>
            Browse and claim donations near you
          </p>
        </div>

        {/* Category Filter Pills */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setCategory("")}
            style={{
              padding: "8px 18px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: 600,
              transition: "all 0.2s",
              background: !category ? "#667eea" : "white",
              color: !category ? "white" : "#4a5568",
              boxShadow: !category
                ? "0 4px 12px rgba(102,126,234,0.3)"
                : "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            All
          </button>
          {categories.map((cat) => {
            const s = getCategoryStyle(cat);
            const active = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "20px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  transition: "all 0.2s",
                  background: active ? s.color : "white",
                  color: active ? "white" : s.color,
                  boxShadow: active
                    ? `0 4px 12px ${s.color}40`
                    : "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                {s.icon} {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            );
          })}
        </div>

        {/* Donation Cards */}
        {filteredDonations.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📦</div>
            <h3 style={{ color: "#1a202c", marginBottom: "0.5rem" }}>
              No Donations Available
            </h3>
            <p style={{ color: "#718096" }}>
              Check back later for new listings.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {filteredDonations.map((donation) => {
              const catS = getCategoryStyle(donation.category);
              return (
                <div
                  key={donation._id}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    transition: "all 0.25s",
                    border: "1px solid #f0f0f0",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 40px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 12px rgba(0,0,0,0.06)";
                  }}
                >
                  {/* Card Top Gradient Bar */}
                  <div
                    style={{
                      height: "4px",
                      background: `linear-gradient(135deg, ${catS.color}, ${catS.color}88)`,
                    }}
                  ></div>

                  <div style={{ padding: "1.5rem" }}>
                    {/* Category + Status Row */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          background: catS.bg,
                          color: catS.color,
                        }}
                      >
                        {catS.icon} {donation.category.toUpperCase()}
                      </span>
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

                    {/* Title */}
                    <h3
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        color: "#1a202c",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {donation.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#718096",
                        marginBottom: "1rem",
                        lineHeight: 1.5,
                      }}
                    >
                      {donation.description}
                    </p>

                    {/* Info Grid */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "0.75rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <div
                        style={{
                          background: "#f7f8fc",
                          borderRadius: "10px",
                          padding: "0.75rem",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.7rem",
                            color: "#a0aec0",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Quantity
                        </div>
                        <div
                          style={{
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            color: "#2d3748",
                          }}
                        >
                          {donation.quantity}
                        </div>
                      </div>
                      <div
                        style={{
                          background: "#f7f8fc",
                          borderRadius: "10px",
                          padding: "0.75rem",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.7rem",
                            color: "#a0aec0",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Condition
                        </div>
                        <div
                          style={{
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            color: "#2d3748",
                          }}
                        >
                          {donation.condition}
                        </div>
                      </div>
                    </div>

                    {donation.expiryDate && (
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "#e53e3e",
                          marginBottom: "0.75rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        ⏰ Expires:{" "}
                        {new Date(donation.expiryDate).toLocaleDateString()}
                      </div>
                    )}
                    {donation.donor && (
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "#718096",
                          marginBottom: "1rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <div
                          style={{
                            width: "22px",
                            height: "22px",
                            borderRadius: "6px",
                            background:
                              "linear-gradient(135deg, #667eea, #764ba2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "0.6rem",
                            fontWeight: 700,
                          }}
                        >
                          {donation.donor.name[0]}
                        </div>
                        {donation.donor.name}
                      </div>
                    )}

                    <button
                      onClick={() => handleClaim(donation._id)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        border: "none",
                        background: "linear-gradient(135deg, #667eea, #764ba2)",
                        color: "white",
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        boxShadow: "0 4px 12px rgba(102,126,234,0.25)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.boxShadow =
                          "0 6px 20px rgba(102,126,234,0.35)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(102,126,234,0.25)";
                      }}
                    >
                      Claim Donation
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationList;
