require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Import Models
const User = require("./models/User");
const Donation = require("./models/Donation");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "sun-donation-secret-key-2026";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/sun-donation";

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// MongoDB Connection
// ============================================
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ============================================
// Initialize seed data
// ============================================
const initializeSeedData = async () => {
  try {
    // Check if users already exist
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log("✅ Database already has users, skipping seed data");
      return;
    }

    // Create hashed passwords for demo users (password: "password123")
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    // Add demo users
    const demoUsers = [
      {
        name: "John Donor",
        email: "donor@example.com",
        password: hashedPassword,
        phone: "555-0101",
        role: "donor",
        location: { city: "New York", state: "NY" },
        orgType: "",
        skills: "",
        points: 50,
      },
      {
        name: "Save Lives Foundation",
        email: "organisation@example.com",
        password: hashedPassword,
        phone: "555-0102",
        role: "organisation",
        location: { city: "San Francisco", state: "CA" },
        orgType: "NGO",
        skills: "Healthcare, Education",
        points: 75,
      },
      {
        name: "Sarah Volunteer",
        email: "volunteer@example.com",
        password: hashedPassword,
        phone: "555-0103",
        role: "volunteer",
        location: { city: "Chicago", state: "IL" },
        orgType: "",
        skills: "Logistics, Community Outreach",
        points: 120,
        certificates: [{ name: "Active Contributor", awardedDate: new Date() }],
      },
    ];

    const createdUsers = await User.insertMany(demoUsers);
    console.log("✅ Seed data initialized with 3 demo accounts");
    console.log("\n  Demo Accounts (password: password123):");
    console.log("    🎁 Donor:        donor@example.com");
    console.log("    🏢 Organisation: organisation@example.com");
    console.log("    👥 Volunteer:    volunteer@example.com\n");

    // Add demo donations
    const demoDonations = [
      {
        title: "Fresh Vegetables & Fruits",
        description: "Organic vegetables and fruits. Perfect for feeding families in need.",
        category: "food",
        quantity: 50,
        condition: "good",
        location: { city: "New York", state: "NY" },
        donorId: createdUsers[0]._id,
        status: "available",
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Winter Clothes Collection",
        description: "Jackets, sweaters, and warm clothing for winter season.",
        category: "clothes",
        quantity: 100,
        condition: "good",
        location: { city: "San Francisco", state: "CA" },
        donorId: createdUsers[1]._id,
        status: "available",
      },
      {
        title: "Children's Story Books",
        description: "Educational storybooks and novels for children aged 3-10 years.",
        category: "books",
        quantity: 75,
        condition: "good",
        location: { city: "Chicago", state: "IL" },
        donorId: createdUsers[2]._id,
        status: "available",
      },
      {
        title: "Laptop and Tablets",
        description: "Gently used laptops and tablets for students.",
        category: "electronics",
        quantity: 10,
        condition: "good",
        location: { city: "New York", state: "NY" },
        donorId: createdUsers[0]._id,
        status: "available",
      },
      {
        title: "Canned Food Items",
        description: "Non-perishable canned food items including beans, vegetables, and soup.",
        category: "food",
        quantity: 200,
        condition: "good",
        location: { city: "San Francisco", state: "CA" },
        donorId: createdUsers[1]._id,
        status: "available",
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Office Furniture",
        description: "Desks, chairs, and shelves in good condition.",
        category: "furniture",
        quantity: 15,
        condition: "good",
        location: { city: "Chicago", state: "IL" },
        donorId: createdUsers[2]._id,
        status: "available",
      },
    ];

    await Donation.insertMany(demoDonations);
    console.log("✅ Created 6 demo donations\n");
  } catch (error) {
    console.error("❌ Error initializing seed data:", error);
  }
};

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
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || "",
      role: role || "donor",
      location: location || { city: "", state: "" },
      orgType: orgType || "",
      skills: skills || "",
      points: 0,
    });

    await newUser.save();

    const token = generateToken(newUser);
    res.status(201).json({ token, user: sanitizeUser(newUser.toObject()) });
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

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);
    res.json({ token, user: sanitizeUser(user.toObject()) });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// GET /api/users/profile
app.get("/api/users/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(sanitizeUser(user.toObject()));
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ============================================
// DONATION ROUTES
// ============================================

// GET /api/donations
app.get("/api/donations", async (req, res) => {
  try {
    const donations = await Donation.find().populate("donorId", "name");
    const publicDonations = donations.map((d) => ({
      ...d.toObject(),
      donor: d.donorId ? { name: d.donorId.name, _id: d.donorId._id } : null,
    }));
    res.json(publicDonations);
  } catch (err) {
    console.error("Get donations error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/donations
app.post("/api/donations", auth, async (req, res) => {
  try {
    const { title, description, category, quantity, condition, location } =
      req.body;

    if (!title || !category) {
      return res
        .status(400)
        .json({ message: "Title and category are required" });
    }

    const donation = new Donation({
      title,
      description: description || "",
      category: category || "other",
      quantity: quantity || 1,
      condition: condition || "good",
      location: location || { city: "", state: "" },
      status: "available",
      donorId: req.user.id,
    });

    await donation.save();

    // Add to donor's donationsMade and update points
    const donor = await User.findById(req.user.id);
    if (donor) {
      donor.donationsMade.push({
        _id: donation._id,
        title: donation.title,
        category: donation.category,
        status: donation.status,
      });
      donor.points += 10;
      await donor.save();
    }

    res.status(201).json(donation);
  } catch (err) {
    console.error("Create donation error:", err);
    res.status(500).json({ message: "Server error creating donation" });
  }
});

// GET /api/donations/:id
app.get("/api/donations/:id", async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate("donorId", "name");
    if (!donation) return res.status(404).json({ message: "Donation not found" });

    res.json({
      ...donation.toObject(),
      donor: donation.donorId ? { name: donation.donorId.name, _id: donation.donorId._id } : null,
    });
  } catch (err) {
    console.error("Get donation error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/donations/:id/claim
app.put("/api/donations/:id/claim", auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: "Donation not found" });

    if (donation.status !== "available") {
      return res
        .status(400)
        .json({ message: "Donation is not available for claiming" });
    }

    donation.status = "claimed";
    donation.claimedBy = req.user.id;
    await donation.save();

    // Update claimer's record
    const claimer = await User.findById(req.user.id);
    if (claimer) {
      claimer.donationsClaimed.push({
        _id: donation._id,
        title: donation.title,
        category: donation.category,
        status: donation.status,
      });
      claimer.points += 5;
      await claimer.save();
    }

    // Update donor's record
    const donor = await User.findById(donation.donorId);
    if (donor) {
      const record = donor.donationsMade.find((d) => d._id.toString() === donation._id.toString());
      if (record) {
        record.status = "claimed";
        await donor.save();
      }
    }

    res.json(donation);
  } catch (err) {
    console.error("Claim donation error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/donations/:id/distribute
app.put("/api/donations/:id/distribute", auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: "Donation not found" });

    donation.status = "distributed";
    donation.distributedBy = req.user.id;
    await donation.save();

    const distributor = await User.findById(req.user.id);
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
          awardedDate: new Date(),
        });
      }
      if (
        totalActions >= 10 &&
        !distributor.certificates.find((c) => c.name === "Super Helper")
      ) {
        distributor.certificates.push({
          name: "Super Helper",
          awardedDate: new Date(),
        });
      }
      await distributor.save();
    }

    res.json(donation);
  } catch (err) {
    console.error("Distribute donation error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ============================================
// LEADERBOARD
// ============================================
app.get("/api/leaderboard", async (req, res) => {
  try {
    const leaderboard = await User.find()
      .select("name role points")
      .sort({ points: -1 })
      .limit(20);
    res.json(leaderboard);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ============================================
// SEED DONATIONS (for demo purposes)
// ============================================
app.post("/api/seed-donations", async (req, res) => {
  try {
    // Get demo users
    const donor1 = await User.findOne({ email: "donor@example.com" });
    const donor2 = await User.findOne({ email: "organisation@example.com" });
    const donor3 = await User.findOne({ email: "volunteer@example.com" });

    if (!donor1 || !donor2 || !donor3) {
      return res.status(400).json({ message: "Demo users not found. Please ensure seed data exists." });
    }

    // Create demo donations
    const demoDonations = [
      {
        title: "Fresh Vegetables & Fruits",
        description: "Organic vegetables and fruits. Perfect for feeding families in need.",
        category: "food",
        quantity: 50,
        condition: "good",
        location: { city: "New York", state: "NY" },
        donorId: donor1._id,
        status: "available",
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Winter Clothes Collection",
        description: "Jackets, sweaters, and warm clothing for winter season.",
        category: "clothes",
        quantity: 100,
        condition: "good",
        location: { city: "San Francisco", state: "CA" },
        donorId: donor2._id,
        status: "available",
      },
      {
        title: "Children's Story Books",
        description: "Educational storybooks and novels for children aged 3-10 years.",
        category: "books",
        quantity: 75,
        condition: "good",
        location: { city: "Chicago", state: "IL" },
        donorId: donor3._id,
        status: "available",
      },
      {
        title: "Laptop and Tablets",
        description: "Gently used laptops and tablets for students.",
        category: "electronics",
        quantity: 10,
        condition: "good",
        location: { city: "New York", state: "NY" },
        donorId: donor1._id,
        status: "available",
      },
      {
        title: "Canned Food Items",
        description: "Non-perishable canned food items including beans, vegetables, and soup.",
        category: "food",
        quantity: 200,
        condition: "good",
        location: { city: "San Francisco", state: "CA" },
        donorId: donor2._id,
        status: "available",
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Office Furniture",
        description: "Desks, chairs, and shelves in good condition.",
        category: "furniture",
        quantity: 15,
        condition: "good",
        location: { city: "Chicago", state: "IL" },
        donorId: donor3._id,
        status: "available",
      },
    ];

    const createdDonations = await Donation.insertMany(demoDonations);
    res.json({ 
      message: "Demo donations created successfully", 
      count: createdDonations.length,
      donations: createdDonations 
    });
  } catch (err) {
    console.error("Seed donations error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, async () => {
  await initializeSeedData();
  console.log(`\n  ✅ SUN Backend Server running on http://localhost:${PORT}`);
  console.log(`  📡 API Base: http://localhost:${PORT}/api`);
  console.log(`  🔗 Register: POST /api/users/register`);
  console.log(`  🔗 Login:    POST /api/users/login`);
  console.log(`  🔗 Profile:  GET  /api/users/profile\n`);
});
