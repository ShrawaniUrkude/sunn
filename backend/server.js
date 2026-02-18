const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;
const JWT_SECRET = "sun-donation-secret-key-2026";

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// In-memory database
// ============================================
const users = [];
const donations = [];
let donationIdCounter = 1;

// ============================================
// Helper: Generate JWT
// ============================================
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
};

// ============================================
// Helper: Auth middleware
// ============================================
const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// ============================================
// Helper: Sanitize user (remove password)
// ============================================
const sanitizeUser = (user) => {
  const { password, ...safe } = user;
  return safe;
};

// ============================================
// AUTH ROUTES
// ============================================

// POST /api/users/register
app.post("/api/users/register", async (req, res) => {
  try {
    const { name, email, password, phone, role, location, orgType, skills } =
      req.body;

    // Validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Check duplicate email
    const existingUser = users.find((u) => u.email === email.toLowerCase());
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = {
      id: String(users.length + 1),
      _id: String(users.length + 1),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || "",
      role: role || "donor",
      location: location || { city: "", state: "" },
      orgType: orgType || "",
      skills: skills || "",
      points: 0,
      donationsMade: [],
      donationsReceived: [],
      donationsClaimed: [],
      certificates: [],
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    const token = generateToken(newUser);
    res.status(201).json({ token, user: sanitizeUser(newUser) });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// POST /api/users/login
app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = users.find((u) => u.email === email.toLowerCase());
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);
    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// GET /api/users/profile
app.get("/api/users/profile", auth, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(sanitizeUser(user));
});

// ============================================
// DONATION ROUTES
// ============================================

// GET /api/donations
app.get("/api/donations", (req, res) => {
  const publicDonations = donations.map((d) => {
    const donor = users.find((u) => u.id === d.donorId);
    return {
      ...d,
      donor: donor ? { name: donor.name, _id: donor.id } : null,
    };
  });
  res.json(publicDonations);
});

// POST /api/donations
app.post("/api/donations", auth, (req, res) => {
  try {
    const { title, description, category, quantity, condition, location } =
      req.body;

    if (!title || !category) {
      return res
        .status(400)
        .json({ message: "Title and category are required" });
    }

    const donation = {
      id: String(donationIdCounter++),
      _id: String(donationIdCounter - 1),
      title,
      description: description || "",
      category: category || "other",
      quantity: quantity || 1,
      condition: condition || "good",
      location: location || { city: "", state: "" },
      status: "available",
      donorId: req.user.id,
      claimedBy: null,
      distributedBy: null,
      createdAt: new Date().toISOString(),
    };

    donations.push(donation);

    // Add to donor's donationsMade
    const donor = users.find((u) => u.id === req.user.id);
    if (donor) {
      donor.donationsMade.push({
        _id: donation.id,
        title: donation.title,
        category: donation.category,
        status: donation.status,
      });
      donor.points += 10;
    }

    res.status(201).json(donation);
  } catch (err) {
    console.error("Create donation error:", err);
    res.status(500).json({ message: "Server error creating donation" });
  }
});

// GET /api/donations/:id
app.get("/api/donations/:id", (req, res) => {
  const donation = donations.find((d) => d.id === req.params.id);
  if (!donation) return res.status(404).json({ message: "Donation not found" });

  const donor = users.find((u) => u.id === donation.donorId);
  res.json({
    ...donation,
    donor: donor ? { name: donor.name, _id: donor.id } : null,
  });
});

// PUT /api/donations/:id/claim
app.put("/api/donations/:id/claim", auth, (req, res) => {
  const donation = donations.find((d) => d.id === req.params.id);
  if (!donation) return res.status(404).json({ message: "Donation not found" });

  if (donation.status !== "available") {
    return res
      .status(400)
      .json({ message: "Donation is not available for claiming" });
  }

  donation.status = "claimed";
  donation.claimedBy = req.user.id;

  const claimer = users.find((u) => u.id === req.user.id);
  if (claimer) {
    claimer.donationsClaimed.push({
      _id: donation.id,
      title: donation.title,
      category: donation.category,
      status: donation.status,
    });
    claimer.points += 5;
  }

  // Update donor's record
  const donor = users.find((u) => u.id === donation.donorId);
  if (donor) {
    const record = donor.donationsMade.find((d) => d._id === donation.id);
    if (record) record.status = "claimed";
  }

  res.json(donation);
});

// PUT /api/donations/:id/distribute
app.put("/api/donations/:id/distribute", auth, (req, res) => {
  const donation = donations.find((d) => d.id === req.params.id);
  if (!donation) return res.status(404).json({ message: "Donation not found" });

  donation.status = "distributed";
  donation.distributedBy = req.user.id;

  const distributor = users.find((u) => u.id === req.user.id);
  if (distributor) {
    distributor.points += 5;

    // Award certificate at milestones
    const totalActions =
      (distributor.donationsMade?.length || 0) +
      (distributor.donationsClaimed?.length || 0);
    if (
      totalActions >= 5 &&
      !distributor.certificates.find((c) => c.name === "Active Contributor")
    ) {
      distributor.certificates.push({
        name: "Active Contributor",
        awardedDate: new Date().toISOString(),
      });
    }
    if (
      totalActions >= 10 &&
      !distributor.certificates.find((c) => c.name === "Super Helper")
    ) {
      distributor.certificates.push({
        name: "Super Helper",
        awardedDate: new Date().toISOString(),
      });
    }
  }

  res.json(donation);
});

// ============================================
// LEADERBOARD
// ============================================
app.get("/api/leaderboard", (req, res) => {
  const leaderboard = users
    .map((u) => ({
      _id: u.id,
      name: u.name,
      role: u.role,
      points: u.points,
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 20);

  res.json(leaderboard);
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`\n  ✅ SUN Backend Server running on http://localhost:${PORT}`);
  console.log(`  📡 API Base: http://localhost:${PORT}/api`);
  console.log(`  🔗 Register: POST /api/users/register`);
  console.log(`  🔗 Login:    POST /api/users/login`);
  console.log(`  🔗 Profile:  GET  /api/users/profile\n`);
});
