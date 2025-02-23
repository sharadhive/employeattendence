const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const multer = require("multer");
const cron = require("node-cron"); // Import node-cron
const Attendance = require("./models/Attendance"); // Import Attendance model

const attendanceRoutes = require("./routes/attendanceRoutes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" })); // Allow large JSON requests

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Image Schema & Model
const ImageSchema = new mongoose.Schema({
  img: {
    data: Buffer,
    contentType: String,
  },
  createdAt: { type: Date, default: Date.now },
});
const Image = mongoose.model("Image", ImageSchema);

app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const newImage = new Image({
      img: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    const savedImage = await newImage.save();
    res.json({ message: "Image uploaded successfully!", imageId: savedImage._id });

  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

app.get("/api/image/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ error: "Image not found" });

    res.set("Content-Type", image.img.contentType);
    res.send(image.img.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch image" });
  }
});

app.use("/api/attendance", attendanceRoutes);

// ✅ Node-Cron Job to Delete Attendance Data Older Than 6 Hours
cron.schedule("0 * * * *", async () => { // Runs every hour
  try {
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000); // 6 hours ago

    // Delete old attendance records
    const result = await Attendance.deleteMany({ createdAt: { $lt: sixHoursAgo } });
    console.log(`🗑️ Deleted ${result.deletedCount} attendance records older than 6 hours`);

  } catch (error) {
    console.error("❌ Error deleting old records:", error);
  }
});

console.log("⏳ Cron job scheduled to delete attendance records older than 6 hours.");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
