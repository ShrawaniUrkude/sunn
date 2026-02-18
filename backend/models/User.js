const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["donor", "organisation", "volunteer"],
      default: "donor",
    },
    location: {
      city: { type: String, default: "" },
      state: { type: String, default: "" },
    },
    orgType: {
      type: String,
      default: "",
    },
    skills: {
      type: String,
      default: "",
    },
    points: {
      type: Number,
      default: 0,
    },
    donationsMade: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        title: String,
        category: String,
        status: String,
      },
    ],
    donationsReceived: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        title: String,
        category: String,
        status: String,
      },
    ],
    donationsClaimed: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        title: String,
        category: String,
        status: String,
      },
    ],
    certificates: [
      {
        name: String,
        awardedDate: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
