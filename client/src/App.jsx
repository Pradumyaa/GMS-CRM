// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import LoginPage from "./pages/LoginPage.jsx";
import AttendanceCalendar from "../src/pages/attendance/AttendanceCalender.jsx";
import HomePage from './pages/HomePage';

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state to show a loader during fetch
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch all employees on component mount
  useEffect(() => {
    const savedEmployeeId = localStorage.getItem("employeeId");

    if (savedEmployeeId) {
      setIsAuthenticated(true); // User is logged in
    }

    const fetchEmployees = async () => {
      try {
        console.log("Fetching employees...");
        const response = await axios.get("http://localhost:3000/api/employees");
        
        console.log("Employees fetched:", response.data);
        setEmployees(response.data); // Set all employees in state
        setFilteredEmployees(response.data); // Initially set filteredEmployees to all employees
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching employees:", error);
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchEmployees();
  }, []);

  // Conditional rendering for loading state
  if (loading) {
    return <div>Loading...</div>; // Show loading until employees are fetched
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/attendance" element={<AttendanceCalendar />} />
        {/* Conditional rendering for authenticated users */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <HomePage
                employees={employees}
                filteredEmployees={filteredEmployees}
                setFilteredEmployees={setFilteredEmployees} // Pass down setter to search and filter employees
              />
            ) : (
              <LoginPage /> // Redirect to login page if not authenticated
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
