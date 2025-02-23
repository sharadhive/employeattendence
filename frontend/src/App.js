import React, { useState } from "react";
import AttendanceForm from "./components/forms/AttendanceForm";
import AdminPanel from "./components/admin/AdminPanel";
import { Container, Box, Typography, Button, TextField } from "@mui/material";
import "./App.css";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPasskey, setAdminPasskey] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const handleAdminAccess = () => {
    if (adminPasskey === "admin1234") {
      setIsAdmin(true);
    } else {
      alert("Incorrect passkey!");
      setAdminPasskey("");
    }
  };

  return (
    <Container maxWidth="md" className="app-container">
      <Box className="intro-section">
        <Typography variant="h2" className="intro-title">
          Employee Attendance System
        </Typography>

        {!showForm && !showAdmin && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            className="open-btn"
            onClick={() => setShowForm(true)}
          >
            Mark Attendance
          </Button>
        )}

        {!showAdmin && !isAdmin && (
          <Box mt={2}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => setShowAdmin(true)}
            >
              Admin Access
            </Button>
          </Box>
        )}
      </Box>

      {showForm && (
        <Box className="form-section">
          <AttendanceForm onClose={() => setShowForm(false)} />
        </Box>
      )}

      {showAdmin && !isAdmin && (
        <Box mt={2}>
          <TextField
            label="Enter Admin Passkey"
            type="password"
            fullWidth
            value={adminPasskey}
            onChange={(e) => setAdminPasskey(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "10px" }}
            onClick={handleAdminAccess}
          >
            Submit
          </Button>
        </Box>
      )}

      {isAdmin && (
        <Box mt={2}>
          <AdminPanel />
        </Box>
      )}
    </Container>
  );
}

export default App;
