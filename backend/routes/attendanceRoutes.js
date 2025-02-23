const express = require("express");
const Attendance = require("../models/Attendance");

const router = express.Router();

// ✅ Mark Attendance with Image
router.post("/", async (req, res) => {
  try {
    const { name, surname, email, location, latitude, longitude, photo } = req.body;

    if (!name || !surname || !email || !location || !latitude || !longitude) {
      return res.status(400).json({ error: "All fields except photo are required" });
    }

    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().split(" ")[0];

    const existingRecord = await Attendance.findOne({ email, date });
    if (existingRecord) {
      return res.status(400).json({ error: "Attendance already marked for today" });
    }

    const newAttendance = new Attendance({
      name,
      surname,
      email,
      location,
      latitude,
      longitude,
      date,
      time,
      photo: photo || "",
    });

    await newAttendance.save();
    res.status(201).json({ message: "Attendance added successfully!", data: newAttendance });

  } catch (error) {
    console.error("Error adding attendance:", error);
    res.status(500).json({ error: "Error adding attendance" });
  }
});

// ✅ Fetch All Attendance
router.get("/", async (req, res) => {
  try {
    const attendanceData = await Attendance.find({});
    res.json(attendanceData);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

// ✅ Search Attendance
router.get("/search", async (req, res) => {
  try {
    const { name, date } = req.query;
    let query = {};

    if (name) query.name = { $regex: name, $options: "i" };
    if (date) query.date = date;

    const filteredData = await Attendance.find(query);
    res.json(filteredData);
  } catch (error) {
    console.error("Error searching attendance:", error);
    res.status(500).json({ error: "Failed to search attendance" });
  }
});

// ✅ Update Attendance Status (On Time / Late)
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    await Attendance.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
});

module.exports = router;
