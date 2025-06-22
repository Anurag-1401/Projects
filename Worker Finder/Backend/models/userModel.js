const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" }, 
    otp: String,
    otpExpiry: Date,
    location: {
      latitude: Number,
      longitude: Number,
      address: String, 
  },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
