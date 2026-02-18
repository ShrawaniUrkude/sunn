import React from "react";
import { Link } from "react-router-dom";
import "../styles/global.css";

const Home = ({ user }) => {
  return (
    <div>
      {/* Hero Section */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          padding: "6rem 2rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Floating orbs */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "10%",
            width: "300px",
            height: "300px",
            background:
              "radial-gradient(circle, rgba(102,126,234,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "10%",
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(118,75,162,0.12) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            right: "30%",
            width: "200px",
            height: "200px",
            background:
              "radial-gradient(circle, rgba(240,147,251,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              fontSize: "1rem",
              color: "rgba(255,255,255,0.5)",
              fontWeight: 600,
              letterSpacing: "3px",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            MAKING A DIFFERENCE TOGETHER
          </div>
          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: 900,
              marginBottom: "1.5rem",
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
              background:
                "linear-gradient(135deg, #ffffff 0%, #a3bffa 50%, #f093fb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Donation Platform
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              color: "rgba(255,255,255,0.6)",
              maxWidth: "600px",
              margin: "0 auto 2.5rem",
              lineHeight: 1.7,
            }}
          >
            Connect donors, volunteers, and organisations to create lasting
            positive impact in communities worldwide.
          </p>

          {!user && (
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link
                to="/donor-register"
                className="btn btn-primary"
                style={{ padding: "14px 36px", fontSize: "1rem" }}
              >
                Get Started
              </Link>
              <Link
                to="/donations"
                className="btn"
                style={{
                  padding: "14px 36px",
                  fontSize: "1rem",
                  background: "rgba(255,255,255,0.08)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                }}
              >
                Browse Donations
              </Link>
            </div>
          )}

          {/* Stats Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "3rem",
              marginTop: "4rem",
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "1000+", label: "Donations Made" },
              { value: "500+", label: "Active Volunteers" },
              { value: "50+", label: "Organisations" },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "#a3bffa",
                    letterSpacing: "-1px",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.4)",
                    fontWeight: 500,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div
        className="container"
        style={{ marginTop: "-2rem", position: "relative", zIndex: 2 }}
      >
        <div className="grid" style={{ gap: "1.25rem" }}>
          {[
            {
              icon: "🎁",
              title: "For Donors",
              desc: "Share your excess food, clothes, toys, and essentials. Track every donation and watch your impact grow.",
              color: "#667eea",
            },
            {
              icon: "👥",
              title: "For Volunteers",
              desc: "Help distribute donations to those in need. Earn points, certificates, and community recognition.",
              color: "#48bb78",
            },
            {
              icon: "🏢",
              title: "For Organisations",
              desc: "Coordinate large-scale donation drives. Manage volunteers and track organizational impact.",
              color: "#ed8936",
            },
            {
              icon: "📍",
              title: "Location-Based",
              desc: "Find donations and volunteers near you. Efficient coordination for quick distribution.",
              color: "#fc5c65",
            },
            {
              icon: "🏆",
              title: "Rewards & Badges",
              desc: "Earn points for every activity. Unlock certificates and climb the leaderboard ranks.",
              color: "#f093fb",
            },
            {
              icon: "📊",
              title: "Track Impact",
              desc: "Detailed analytics on donations made, people helped, and the overall community impact.",
              color: "#4299e1",
            },
          ].map((feature, i) => (
            <div key={i} className="card" style={{ cursor: "default" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "14px",
                  background: `linear-gradient(135deg, ${feature.color}15, ${feature.color}25)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                }}
              >
                {feature.icon}
              </div>
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#1a202c",
                  marginBottom: "0.5rem",
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  color: "#718096",
                  fontSize: "0.9rem",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Role Selection CTA */}
      {!user && (
        <div
          className="container"
          style={{ marginTop: "4rem", marginBottom: "4rem" }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #1a1a2e, #16213e)",
              borderRadius: "24px",
              padding: "3.5rem 2rem",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-50%",
                right: "-20%",
                width: "500px",
                height: "500px",
                background:
                  "radial-gradient(circle, rgba(102,126,234,0.1) 0%, transparent 70%)",
                borderRadius: "50%",
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "white",
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.5px",
                }}
              >
                Ready to Make a Difference?
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: "2rem",
                  fontSize: "1.05rem",
                }}
              >
                Choose your role and join thousands of people building a better
                community.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Link
                  to="/donor-register"
                  className="btn"
                  style={{
                    padding: "14px 28px",
                    background: "linear-gradient(135deg, #667eea, #5a67d8)",
                    color: "white",
                    boxShadow: "0 4px 20px rgba(102,126,234,0.4)",
                  }}
                >
                  🎁 Join as Donor
                </Link>
                <Link
                  to="/organisation-register"
                  className="btn"
                  style={{
                    padding: "14px 28px",
                    background: "linear-gradient(135deg, #ed8936, #dd6b20)",
                    color: "white",
                    boxShadow: "0 4px 20px rgba(237,137,54,0.4)",
                  }}
                >
                  🏢 Join as Organisation
                </Link>
                <Link
                  to="/volunteer-register"
                  className="btn"
                  style={{
                    padding: "14px 28px",
                    background: "linear-gradient(135deg, #48bb78, #38a169)",
                    color: "white",
                    boxShadow: "0 4px 20px rgba(72,187,120,0.4)",
                  }}
                >
                  👥 Join as Volunteer
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
