import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/global.css";

const Navigation = ({ user, onLogout }) => {
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showRegisterDropdown, setShowRegisterDropdown] = useState(false);

  const getDashboardLink = () => {
    if (!user) return "/";
    switch (user.role) {
      case "donor":
        return "/donor-dashboard";
      case "organisation":
        return "/organisation-dashboard";
      case "volunteer":
        return "/volunteer-dashboard";
      default:
        return "/dashboard";
    }
  };

  const getRoleBadge = () => {
    if (!user) return null;
    const config = {
      donor: {
        icon: "🎁",
        label: "Donor",
        bg: "rgba(102,126,234,0.15)",
        color: "#a3bffa",
      },
      organisation: {
        icon: "🏢",
        label: "Organisation",
        bg: "rgba(237,137,54,0.15)",
        color: "#fbd38d",
      },
      volunteer: {
        icon: "👥",
        label: "Volunteer",
        bg: "rgba(72,187,120,0.15)",
        color: "#9ae6b4",
      },
    };
    const c = config[user.role] || config.donor;
    return (
      <span
        style={{
          background: c.bg,
          color: c.color,
          padding: "4px 12px",
          borderRadius: "50px",
          fontSize: "0.8rem",
          fontWeight: 600,
          marginLeft: "4px",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        {c.icon} {c.label}
      </span>
    );
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          ♥ SUN Donation
        </Link>
        <ul className="navbar-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/donations">Donations</Link>
          </li>
          <li>
            <Link to="/leaderboard">Leaderboard</Link>
          </li>
          {user ? (
            <>
              {user.role === "donor" && (
                <li>
                  <Link
                    to="/create-donation"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(102,126,234,0.15), rgba(118,75,162,0.15))",
                      color: "#a3bffa",
                    }}
                  >
                    + Create
                  </Link>
                </li>
              )}
              <li>
                <Link
                  to={getDashboardLink()}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  Dashboard {getRoleBadge()}
                </Link>
              </li>
              <li>
                <a
                  href="#logout"
                  onClick={onLogout}
                  style={{ color: "rgba(252,92,101,0.8)" }}
                >
                  Logout
                </a>
              </li>
            </>
          ) : (
            <>
              <li
                className="nav-dropdown"
                onMouseEnter={() => setShowLoginDropdown(true)}
                onMouseLeave={() => setShowLoginDropdown(false)}
              >
                <span className="nav-dropdown-trigger">Sign In ▾</span>
                {showLoginDropdown && (
                  <ul className="nav-dropdown-menu">
                    <li>
                      <Link
                        to="/donor-login"
                        onClick={() => setShowLoginDropdown(false)}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <span style={{ fontSize: "1.2rem" }}>🎁</span>
                          <span>
                            <div style={{ fontWeight: 600 }}>Donor Login</div>
                            <div style={{ fontSize: "0.75rem", opacity: 0.6 }}>
                              Share your donations
                            </div>
                          </span>
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/organisation-login"
                        onClick={() => setShowLoginDropdown(false)}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <span style={{ fontSize: "1.2rem" }}>🏢</span>
                          <span>
                            <div style={{ fontWeight: 600 }}>
                              Organisation Login
                            </div>
                            <div style={{ fontSize: "0.75rem", opacity: 0.6 }}>
                              Manage campaigns
                            </div>
                          </span>
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/volunteer-login"
                        onClick={() => setShowLoginDropdown(false)}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <span style={{ fontSize: "1.2rem" }}>👥</span>
                          <span>
                            <div style={{ fontWeight: 600 }}>
                              Volunteer Login
                            </div>
                            <div style={{ fontSize: "0.75rem", opacity: 0.6 }}>
                              Help distribute
                            </div>
                          </span>
                        </span>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li
                className="nav-dropdown"
                onMouseEnter={() => setShowRegisterDropdown(true)}
                onMouseLeave={() => setShowRegisterDropdown(false)}
              >
                <span
                  className="nav-dropdown-trigger"
                  style={{
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    color: "white",
                    padding: "8px 20px",
                    borderRadius: "8px",
                    fontWeight: 600,
                  }}
                >
                  Join Now ▾
                </span>
                {showRegisterDropdown && (
                  <ul className="nav-dropdown-menu">
                    <li>
                      <Link
                        to="/donor-register"
                        onClick={() => setShowRegisterDropdown(false)}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <span style={{ fontSize: "1.2rem" }}>🎁</span>
                          <span>
                            <div style={{ fontWeight: 600 }}>Donor Signup</div>
                            <div style={{ fontSize: "0.75rem", opacity: 0.6 }}>
                              Start donating today
                            </div>
                          </span>
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/organisation-register"
                        onClick={() => setShowRegisterDropdown(false)}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <span style={{ fontSize: "1.2rem" }}>🏢</span>
                          <span>
                            <div style={{ fontWeight: 600 }}>
                              Organisation Signup
                            </div>
                            <div style={{ fontSize: "0.75rem", opacity: 0.6 }}>
                              Register your org
                            </div>
                          </span>
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/volunteer-register"
                        onClick={() => setShowRegisterDropdown(false)}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <span style={{ fontSize: "1.2rem" }}>👥</span>
                          <span>
                            <div style={{ fontWeight: 600 }}>
                              Volunteer Signup
                            </div>
                            <div style={{ fontSize: "0.75rem", opacity: 0.6 }}>
                              Join the mission
                            </div>
                          </span>
                        </span>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
