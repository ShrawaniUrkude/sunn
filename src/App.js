import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./pages/Home";
import DonationList from "./components/DonationList";
import CreateDonation from "./components/CreateDonation";
import Dashboard from "./components/Dashboard";
import Leaderboard from "./components/Leaderboard";

// Donor
import DonorLogin from "./components/DonorLogin";
import DonorRegister from "./components/DonorRegister";
import DonorDashboard from "./components/DonorDashboard";

// Organisation
import OrganisationLogin from "./components/OrganisationLogin";
import OrganisationRegister from "./components/OrganisationRegister";
import OrganisationDashboard from "./components/OrganisationDashboard";

// Volunteer
import VolunteerLogin from "./components/VolunteerLogin";
import VolunteerRegister from "./components/VolunteerRegister";
import VolunteerDashboard from "./components/VolunteerDashboard";

import "./styles/global.css";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleLoginSuccess = () => {
    const savedUser = localStorage.getItem("user");
    setUser(savedUser ? JSON.parse(savedUser) : null);
  };

  return (
    <Router>
      <Navigation user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route
          path="/register"
          element={<Register onSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/login"
          element={<Login onSuccess={handleLoginSuccess} />}
        />
        <Route path="/donations" element={<DonationList />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route
          path="/create-donation"
          element={
            user?.role === "donor" ? (
              <CreateDonation token={token} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Legacy Dashboard */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard token={token} user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Donor Routes */}
        <Route
          path="/donor-login"
          element={<DonorLogin onSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/donor-register"
          element={<DonorRegister onSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/donor-dashboard"
          element={
            user?.role === "donor" ? (
              <DonorDashboard token={token} user={user} />
            ) : (
              <Navigate to="/donor-login" />
            )
          }
        />

        {/* Organisation Routes */}
        <Route
          path="/organisation-login"
          element={<OrganisationLogin onSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/organisation-register"
          element={<OrganisationRegister onSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/organisation-dashboard"
          element={
            user?.role === "organisation" ? (
              <OrganisationDashboard token={token} user={user} />
            ) : (
              <Navigate to="/organisation-login" />
            )
          }
        />

        {/* Volunteer Routes */}
        <Route
          path="/volunteer-login"
          element={<VolunteerLogin onSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/volunteer-register"
          element={<VolunteerRegister onSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/volunteer-dashboard"
          element={
            user?.role === "volunteer" ? (
              <VolunteerDashboard token={token} user={user} />
            ) : (
              <Navigate to="/volunteer-login" />
            )
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
