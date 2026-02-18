const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: ["food", "clothes", "books", "electronics", "furniture", "other"],
      default: "other",
    },
    quantity: {
      type: Number,
      default: 1,
    },
    condition: {
      type: String,
      enum: ["new", "good", "fair"],
      default: "good",
    },
    location: {
      city: { type: String, default: "" },
      state: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: ["available", "claimed", "distributed"],
      default: "available",
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    distributedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Donation", donationSchema);
