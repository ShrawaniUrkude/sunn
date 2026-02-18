import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/global.css";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const DonorDashboard = ({ token, user }) => {
  const [profile, setProfile] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await axios.get(`${API_BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(profileResponse.data);

        const donationsResponse = await axios.get(`${API_BASE_URL}/donations`);
        setDonations(donationsResponse.data);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // Donation categories with colors and icons
  const donationCategories = [
    { id: "food", label: "Food & Groceries", icon: "🍞", color: "#48bb78", bg: "#e6fffa" },
    { id: "clothes", label: "Clothes & Footwear", icon: "👕", color: "#667eea", bg: "#ebf4ff" },
    { id: "books", label: "Books & Education", icon: "📚", color: "#ed8936", bg: "#fff5eb" },
    { id: "electronics", label: "Electronics", icon: "📱", color: "#fc5c65", bg: "#fff5f7" },
    { id: "furniture", label: "Furniture", icon: "🛋️", color: "#764ba2", bg: "#f3e8ff" },
    { id: "other", label: "Other Items", icon: "📦", color: "#9f7aea", bg: "#faf5ff" },
  ];

  // Get category donations summary
  const getCategorySummary = (categoryId) => {
    const categoryDonations = donations.filter(d => d.category === categoryId);
    const totalQuantity = categoryDonations.reduce((sum, d) => sum + (d.quantity || 0), 0);
    
    return {
      total: categoryDonations.length,
      available: categoryDonations.filter(d => d.status === "available").length,
      claimed: categoryDonations.filter(d => d.status === "claimed").length,
      distributed: categoryDonations.filter(d => d.status === "distributed").length,
      totalQuantity,
      donations: categoryDonations,
    };
  };

  // Get impact badges based on points and donation count
  const getImpactBadges = () => {
    const badges = [];
    const total = profile?.donationsMade?.length || 0;

    if (profile?.points >= 50) badges.push({ name: "Rising Star", emoji: "⭐", requirement: "50+ points" });
    if (total >= 3) badges.push({ name: "Generous", emoji: "💝", requirement: "3+ donations" });
    if (profile?.points >= 100) badges.push({ name: "Impact Leader", emoji: "🎖️", requirement: "100+ points" });
    if (total >= 5) badges.push({ name: "Community Hero", emoji: "🦸", requirement: "5+ donations" });

    return badges;
  };

  // Get urgent needs (filter donations by status)
  const getUrgentNeeds = () => {
    return donations
      .filter(d => d.status === "available")
      .slice(0, 4);
  };

  const accent = "#667eea";
  const accentGradient = "linear-gradient(135deg, #667eea, #5a67d8)";

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

  const badges = getImpactBadges();
  const urgentNeeds = getUrgentNeeds();
  const selectedCategoryData = selectedCategory ? donationCategories.find(c => c.id === selectedCategory) : null;
  const categorySummary = selectedCategory ? getCategorySummary(selectedCategory) : null;

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
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}
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
              display: "flex",
              alignItems: "center",
              gap: "2.5rem",
              flexWrap: "wrap",
            }}
          >
            {/* Icon */}
            <div
              style={{
                minWidth: 90,
                width: 90,
                height: 90,
                borderRadius: 24,
                background: "rgba(255,255,255,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 48,
              }}
            >
              ❤️
            </div>
            {/* Content */}
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "0.9rem", opacity: 0.85, margin: 0 }}>Welcome back,</p>
              <h1 style={{ fontSize: "2rem", fontWeight: 900, margin: "0.25rem 0", letterSpacing: 1 }}>
                {profile?.name || user?.name}
              </h1>
              <p style={{ opacity: 0.8, marginTop: "0.5rem", fontSize: "0.95rem", margin: 0 }}>
                Keep sharing to make an impact in the community!
              </p>
            </div>
            {/* Stats */}
            <div
              style={{
                textAlign: "center",
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                padding: "1.25rem 2rem",
              }}
            >
              <div style={{ fontSize: "2.5rem", fontWeight: 900, lineHeight: 1 }}>
                {profile?.points || 0}
              </div>
              <div style={{ fontSize: "0.8rem", opacity: 0.85, marginTop: "0.25rem", textTransform: "uppercase" }}>
                Points
              </div>
            </div>
          </div>
        </div>

        {/* Impact Badges Section */}
        {badges.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem", color: "#1a202c" }}>
              🏅 Your Impact Badges
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
              }}
            >
              {badges.map((badge, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    padding: "1.5rem",
                    border: "2px solid #e2e8f0",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(102,126,234,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
                  }}
                >
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{badge.emoji}</div>
                  <h4 style={{ margin: "0.5rem 0 0.25rem", fontWeight: 700, color: "#1a202c" }}>
                    {badge.name}
                  </h4>
                  <p style={{ fontSize: "0.8rem", color: "#718096", margin: 0 }}>
                    {badge.requirement}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What You're Giving Today Section */}
        <div style={{ marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem", color: "#1a202c" }}>
            💝 What You Can Give Today
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "1rem",
            }}
          >
            {donationCategories.map((category) => (
              <div
                key={category.id}
                style={{
                  background: category.bg,
                  borderRadius: "16px",
                  padding: "1.5rem",
                  textAlign: "center",
                  border: selectedCategory === category.id ? `3px solid ${category.color}` : `2px solid ${category.color}20`,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: selectedCategory === category.id ? `0 8px 20px ${category.color}35` : "none",
                }}
                onClick={() => setSelectedCategory(category.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = `0 8px 20px ${category.color}25`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  if (selectedCategory !== category.id) {
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
                  {category.icon}
                </div>
                <h4 style={{ margin: "0.5rem 0", fontWeight: 600, color: category.color, fontSize: "0.95rem" }}>
                  {category.label}
                </h4>
                {selectedCategory === category.id && (
                  <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", fontWeight: 700, color: category.color }}>
                    ✓ Selected
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Urgent Needs Near You Section */}
        {urgentNeeds.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem", color: "#1a202c" }}>
              🚨 Urgent Needs Near You
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {urgentNeeds.map((need) => {
                const category = donationCategories.find(c => c.id === need.category);
                return (
                  <div
                    key={need._id}
                    style={{
                      background: "white",
                      borderRadius: "16px",
                      padding: "1.5rem",
                      border: "2px solid #fbd38d",
                      boxShadow: "0 4px 12px rgba(248, 187, 0, 0.15)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Urgent badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: "1rem",
                        right: "1rem",
                        background: "#fc5c65",
                        color: "white",
                        padding: "0.35rem 0.75rem",
                        borderRadius: "20px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      Urgent
                    </div>

                    {/* Icon and Category */}
                    <div style={{ marginBottom: "1rem" }}>
                      <span style={{ fontSize: "1.8rem", marginRight: "0.5rem" }}>
                        {category?.icon}
                      </span>
                      <h4 style={{ margin: 0, color: "#1a202c", fontWeight: 700 }}>
                        {need.title}
                      </h4>
                    </div>

                    {/* Description */}
                    {need.description && (
                      <p style={{ fontSize: "0.9rem", color: "#718096", marginBottom: "1rem", margin: "0.5rem 0" }}>
                        {need.description.substring(0, 100)}...
                      </p>
                    )}

                    {/* Location and Quantity */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.85rem",
                        color: "#667eea",
                        fontWeight: 600,
                      }}
                    >
                      <span>📍 {need.location?.city || "Unknown"}</span>
                      <span>📦 Qty: {need.quantity}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {urgentNeeds.length === 0 && (
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "2rem",
              textAlign: "center",
              border: "2px dashed #cbd5e0",
            }}
          >
            <p style={{ color: "#718096", fontSize: "1rem", margin: 0 }}>
              ✨ No urgent needs currently. Check back soon!
            </p>
          </div>
        )}

        {/* Donor Stats */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "2rem",
            marginTop: "2rem",
            border: "2px solid #e2e8f0",
          }}
        >
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.5rem", color: "#1a202c" }}>
            📊 Your Donor Statistics
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "1.5rem",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: "#667eea" }}>
                {profile?.donationsMade?.length || 0}
              </div>
              <p style={{ color: "#718096", fontSize: "0.9rem", margin: "0.5rem 0 0" }}>
                Donations Made
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: "#48bb78" }}>
                {profile?.points || 0}
              </div>
              <p style={{ color: "#718096", fontSize: "0.9rem", margin: "0.5rem 0 0" }}>
                Total Points
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: "#ed8936" }}>
                {profile?.certificates?.length || 0}
              </div>
              <p style={{ color: "#718096", fontSize: "0.9rem", margin: "0.5rem 0 0" }}>
                Certificates
              </p>
            </div>
          </div>
        </div>

        {/* Category Summary Modal */}
        {selectedCategory && selectedCategoryData && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "1rem",
            }}
            onClick={() => setSelectedCategory(null)}
          >
            <div
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "2rem",
                maxWidth: "600px",
                width: "100%",
                maxHeight: "85vh",
                overflow: "auto",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.5rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <h2 style={{ fontSize: "1.8rem", margin: 0 }}>
                    {selectedCategoryData.icon}
                  </h2>
                  <div>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 900, margin: 0, color: "#1a202c" }}>
                      {selectedCategoryData.label}
                    </h2>
                    <p style={{ fontSize: "0.85rem", color: "#718096", margin: "0.25rem 0 0" }}>
                      Donation Summary
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    color: "#718096",
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Stats Box */}
              <div
                style={{
                  background: selectedCategoryData.bg,
                  borderLeft: `4px solid ${selectedCategoryData.color}`,
                  borderRadius: "12px",
                  padding: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: selectedCategoryData.color, textTransform: "uppercase", margin: "0 0 1rem" }}>
                  📊 Category Statistics
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "1.8rem", fontWeight: 900, color: selectedCategoryData.color }}>
                      {categorySummary.total}
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "#718096", margin: "0.25rem 0 0" }}>
                      Total Donations
                    </p>
                  </div>
                  <div>
                    <div style={{ fontSize: "1.8rem", fontWeight: 900, color: selectedCategoryData.color }}>
                      {categorySummary.totalQuantity}
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "#718096", margin: "0.25rem 0 0" }}>
                      Total Quantity
                    </p>
                  </div>
                  <div>
                    <div
                      style={{
                        display: "inline-block",
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        color: "#48bb78",
                        background: "#e6fffa",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "8px",
                      }}
                    >
                      {categorySummary.available}
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "#718096", margin: "0.5rem 0 0" }}>
                      Available
                    </p>
                  </div>
                  <div>
                    <div
                      style={{
                        display: "inline-block",
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        color: "#667eea",
                        background: "#ebf4ff",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "8px",
                      }}
                    >
                      {categorySummary.claimed}
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "#718096", margin: "0.5rem 0 0" }}>
                      Claimed
                    </p>
                  </div>
                </div>
              </div>

              {/* Donation List */}
              <div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1a202c", marginBottom: "1rem" }}>
                  📦 Donations in This Category
                </h4>
                {categorySummary.donations.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                      maxHeight: "300px",
                      overflowY: "auto",
                    }}
                  >
                    {categorySummary.donations.map((donation) => (
                      <div
                        key={donation._id}
                        style={{
                          background: "#f7f8fc",
                          borderRadius: "12px",
                          padding: "1rem",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "start",
                            gap: "1rem",
                          }}
                        >
                          <div>
                            <h5 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1a202c", margin: 0 }}>
                              {donation.title}
                            </h5>
                            <p style={{ fontSize: "0.8rem", color: "#718096", margin: "0.35rem 0 0" }}>
                              {donation.description && donation.description.substring(0, 60)}...
                            </p>
                            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", fontSize: "0.75rem", color: "#667eea", fontWeight: 600 }}>
                              <span>📦 Qty: {donation.quantity}</span>
                              <span>📍 {donation.location?.city || "Unknown"}</span>
                            </div>
                          </div>
                          <div
                            style={{
                              display: "inline-block",
                              padding: "0.35rem 0.75rem",
                              borderRadius: "8px",
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              background: donation.status === "available" ? "#e6fffa" : donation.status === "claimed" ? "#ebf4ff" : "#fff5eb",
                              color: donation.status === "available" ? "#48bb78" : donation.status === "claimed" ? "#667eea" : "#ed8936",
                            }}
                          >
                            {donation.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      background: "#f7f8fc",
                      borderRadius: "12px",
                      padding: "1.5rem",
                      textAlign: "center",
                      color: "#718096",
                      fontSize: "0.9rem",
                    }}
                  >
                    No donations in this category yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorDashboard;
