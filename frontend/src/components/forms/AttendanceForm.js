import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactWebcam from "react-webcam";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import "../css/AttendanceForm.css"; // Adjust the path if needed

const AttendanceForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    location: "",
    latitude: null,
    longitude: null,
    date: "",
    time: "",
    photo: "" // Optional field for captured photo
  });

  const webcamRef = useRef(null);
  const [cameraError, setCameraError] = useState("");

  useEffect(() => {
    // Fetch location and current date/time on mount
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            latitude,
            longitude,
            location: `Lat: ${latitude}, Lng: ${longitude}`
          }));
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    const formattedTime = now.toLocaleTimeString();
    setFormData(prev => ({
      ...prev,
      date: formattedDate,
      time: formattedTime
    }));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const capturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setFormData(prev => ({ ...prev, photo: imageSrc }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Photo is optional; submission proceeds even if no photo is captured.
    try {
      const response = await axios.post("https://employattentbackend.onrender.com/api/attendance", formData);
      alert("Attendance submitted successfully!");
      console.log(response.data);
      onClose(); // Optionally close the form after successful submission
    } catch (error) {
      console.error("Error submitting attendance:", error);
      alert("Failed to submit attendance.");
    }
  };

  return (
    <Container maxWidth="sm" className="attendance-container">
      <Typography variant="h4" align="center" className="animated-text">
        Employee Attendance
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box my={2}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Box>
        <Box my={2}>
          <TextField
            fullWidth
            label="Surname"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            required
          />
        </Box>
        <Box my={2}>
          <TextField
            fullWidth
            type="email"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Box>
        <Box my={2}>
          <TextField fullWidth label="Location" value={formData.location} disabled />
        </Box>
        <Box my={2}>
          <TextField fullWidth label="Date" value={formData.date} disabled />
        </Box>
        <Box my={2}>
          <TextField fullWidth label="Time" value={formData.time} disabled />
        </Box>
        {/* Camera Section */}
        <Box my={2}>
          {!formData.photo ? (
            <>
              <ReactWebcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "user" }}
                onUserMediaError={(error) => {
                  console.error("Camera error:", error);
                  setCameraError("Camera access denied or not available.");
                }}
              />
              {cameraError && <Typography color="error">{cameraError}</Typography>}
              <Button
                variant="contained"
                color="secondary"
                onClick={capturePhoto}
                fullWidth
                style={{ marginTop: "10px" }}
              >
                Capture Photo (Optional)
              </Button>
            </>
          ) : (
            <>
              <img src={formData.photo} alt="Captured" style={{ width: "100%", borderRadius: "4px" }} />
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setFormData(prev => ({ ...prev, photo: "" }))}
                fullWidth
                style={{ marginTop: "10px" }}
              >
                Retake Photo
              </Button>
            </>
          )}
        </Box>
        <Button type="submit" variant="contained" color="primary" fullWidth className="submit-button">
          Submit Attendance
        </Button>
      </form>
    </Container>
  );
};

export default AttendanceForm;
