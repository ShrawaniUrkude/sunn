import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/global.css";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const DonationDetail = ({ donationId, token, onClose }) => {
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [peopleHelped, setPeopleHelped] = useState(1);
  const [donationNotes, setDonationNotes] = useState("");
  const [distributing, setDistributing] = useState(false);

  useEffect(() => {
    fetchDonationDetail();
  }, [donationId]);

  const fetchDonationDetail = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/donations/${donationId}`,
      );
      setDonation(response.data);
    } catch (error) {
      console.error("Error fetching donation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDistribute = async () => {
    if (!recipientEmail) {
      alert("Please enter recipient email");
      return;
    }
    setDistributing(true);
    try {
      await axios.post(
        `${API_BASE_URL}/donations/${donationId}/distribute`,
        { recipientId: "recipient-id", peopleHelped: parseInt(peopleHelped) },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("Donation distributed successfully!");
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to distribute donation");
    } finally {
      setDistributing(false);
    }
  };

  const getCategoryStyle = (cat) => {
    const map = {
      food: { bg: "#fed7d7", color: "#c53030", icon: "\ud83c\udf5e" },
      clothes: { bg: "#bee3f8", color: "#2b6cb0", icon: "\ud83d\udc55" },
      toys: { bg: "#fefcbf", color: "#975a16", icon: "\ud83e\uddf8" },
      essentials: { bg: "#c6f6d5", color: "#276749", icon: "\ud83c\udfe5" },
      other: { bg: "#e2e8f0", color: "#4a5568", icon: "\ud83d\udce6" },
    };
    return map[cat] || map.other;
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid #667eea22",
            borderTopColor: "#667eea",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        ></div>
      </div>
    );

  if (!donation)
    return (
      <div className="alert alert-error" style={{ maxWidth: 500 }}>
        Donation not found
      </div>
    );

  const catS = getCategoryStyle(donation.category);

  return (
    <div
      style={{
        background: "white",
        borderRadius: "20px",
        maxWidth: "560px",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      }}
    >
      {/* Top gradient bar */}
      <div
        style={{
          height: "6px",
          background: `linear-gradient(135deg, ${catS.color}, ${catS.color}88)`,
        }}
      ></div>

      <div style={{ padding: "2rem" }}>
        {/* Category + Status */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <span
            style={{
              padding: "5px 14px",
              borderRadius: "20px",
              fontSize: "0.8rem",
              fontWeight: 600,
              background: catS.bg,
              color: catS.color,
            }}
          >
            {catS.icon} {donation.category.toUpperCase()}
          </span>
          <span
            style={{
              padding: "5px 14px",
              borderRadius: "20px",
              fontSize: "0.8rem",
              fontWeight: 600,
              background: "#c6f6d5",
              color: "#276749",
            }}
          >
            {donation.status}
          </span>
        </div>

        <h2
          style={{
            fontSize: "1.4rem",
            fontWeight: 800,
            color: "#1a202c",
            marginBottom: "0.5rem",
          }}
        >
          {donation.title}
        </h2>
        <p
          style={{
            color: "#718096",
            fontSize: "0.9rem",
            lineHeight: 1.6,
            marginBottom: "1.25rem",
          }}
        >
          {donation.description}
        </p>

        {/* Info Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "0.75rem",
            marginBottom: "1.25rem",
          }}
        >
          {[
            ["Quantity", donation.quantity],
            ["Condition", donation.condition],
            ["Category", donation.category],
          ].map(([l, v]) => (
            <div
              key={l}
              style={{
                background: "#f7f8fc",
                borderRadius: "12px",
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
                {l}
              </div>
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#2d3748",
                  marginTop: "2px",
                }}
              >
                {v}
              </div>
            </div>
          ))}
        </div>

        {donation.donor && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem",
              background: "#f7f8fc",
              borderRadius: "12px",
              marginBottom: "1.25rem",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                fontSize: "0.85rem",
              }}
            >
              {donation.donor.name[0]}
            </div>
            <div>
              <div
                style={{
                  fontWeight: 600,
                  color: "#1a202c",
                  fontSize: "0.9rem",
                }}
              >
                {donation.donor.name}
              </div>
              <div style={{ fontSize: "0.8rem", color: "#718096" }}>
                {donation.donor.phone}
              </div>
            </div>
          </div>
        )}

        {/* Location Map */}
        {donation.location && (donation.location.city || donation.location.state) && (
          <div
            style={{
              marginBottom: "1.25rem",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                padding: "0.75rem 1rem",
                background: "#f7f8fc",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>📍</span>
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    color: "#1a202c",
                    fontSize: "0.9rem",
                  }}
                >
                  Donation Location
                </div>
                <div style={{ fontSize: "0.8rem", color: "#718096" }}>
                  {donation.location.city}, {donation.location.state}
                </div>
              </div>
            </div>
            <iframe
              width="100%"
              height="250"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
                `${donation.location.city}, ${donation.location.state}`
              )}&zoom=12`}
            ></iframe>
          </div>
        )}

        {/* Distribution Form */}
        {donation.status === "claimed" && token && (
          <div
            style={{
              padding: "1.25rem",
              background: "#f0f4ff",
              borderRadius: "14px",
              border: "1px solid #667eea20",
              marginBottom: "1rem",
            }}
          >
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "#1a202c",
                marginBottom: "1rem",
              }}
            >
              \u2705 Mark as Distributed
            </h3>
            <div className="form-group" style={{ marginBottom: "0.75rem" }}>
              <label className="form-label">Recipient Email</label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="form-input"
                placeholder="recipient@example.com"
              />
            </div>
            <div className="form-group" style={{ marginBottom: "1rem" }}>
              <label className="form-label">People Helped</label>
              <input
                type="number"
                value={peopleHelped}
                onChange={(e) => setPeopleHelped(e.target.value)}
                className="form-input"
                min="1"
              />
            </div>
            <div className="form-group" style={{ marginBottom: "1rem" }}>
              <label className="form-label">Donation Details / Notes</label>
              <textarea
                value={donationNotes}
                onChange={(e) => setDonationNotes(e.target.value)}
                className="form-input"
                placeholder="Add any additional details about the donation distribution..."
                rows="3"
                style={{ resize: "vertical" }}
              />
            </div>
            <button
              onClick={handleDistribute}
              disabled={distributing}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #48bb78, #38a169)",
                color: "white",
                fontSize: "0.9rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(72,187,120,0.25)",
              }}
            >
              {distributing ? "Distributing..." : "\u2705 Confirm Distribution"}
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "2px solid #e2e8f0",
            background: "transparent",
            color: "#4a5568",
            fontSize: "0.9rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#667eea";
            e.currentTarget.style.color = "#667eea";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.color = "#4a5568";
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DonationDetail;
