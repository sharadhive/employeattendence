import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Container, TextField } from "@mui/material";
import * as XLSX from "xlsx";
import "../css/AttendanceForm.css";

const AdminPanel = () => {
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState({ name: "", date: "" });

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get("https://employattentbackend.onrender.com/api/attendance");
      setAttendance(response.data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/attendance/search", {
        params: { name: search.name, date: search.date },
      });
      setAttendance(response.data);
    } catch (error) {
      console.error("Error searching attendance:", error);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/attendance/${id}`, { status });
      fetchAttendance();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(attendance);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Data");
    XLSX.writeFile(workbook, "Attendance.xlsx");
  };

  return (
    <Container className="admin-container">
      <h2 className="intro-title">Admin Panel</h2>

      <TextField
        label="Search by Name"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={(e) => setSearch({ ...search, name: e.target.value })}
      />
      <TextField
        label="Search by Date"
        type="date"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={(e) => setSearch({ ...search, date: e.target.value })}
      />
      <Button variant="contained" color="primary" onClick={handleSearch} className="search-btn">
        Search
      </Button>

      <Table className="responsive-table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Surname</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Photo</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendance.map((entry) => (
            <TableRow key={entry._id}>
              <TableCell>{entry.name}</TableCell>
              <TableCell>{entry.surname}</TableCell>
              <TableCell>{entry.email}</TableCell>
              <TableCell>{entry.date}</TableCell>
              <TableCell>{entry.time}</TableCell>
              <TableCell>
                {entry.photo ? (
                  <img src={`data:image/jpeg;base64,${entry.photo}`} alt="User" width="50" height="50" className="profile-pic" />
                ) : (
                  "No Image"
                )}
              </TableCell>
              <TableCell>{entry.status}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleStatusChange(entry._id, "On Time")}
                  className="status-btn on-time-btn"
                >
                  On Time
                </Button>
                <Button
                  onClick={() => handleStatusChange(entry._id, "Late")}
                  className="status-btn late-btn"
                >
                  Late
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button variant="contained" color="primary" onClick={handleDownload} className="download-btn">
        Download Excel
      </Button>
    </Container>
  );
};

export default AdminPanel;
