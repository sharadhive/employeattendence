const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true }, 
  location: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  time: { type: String, required: true }, // Format: HH:MM:SS
  photo: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now, expires: 86400 } // Auto-delete after 24 hours
});

// Remove unique index from email if it exists
AttendanceSchema.index({ email: 1 }, { unique: false });

module.exports = mongoose.model("Attendance", AttendanceSchema);
