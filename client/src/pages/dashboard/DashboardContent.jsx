import React, { useState, useEffect } from "react";
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button";
import { Clock, CalendarCheck, Briefcase } from "lucide-react";
import DashboardGreeting from "./DashboardGreeting";

const DashboardContent = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [workSessions, setWorkSessions] = useState([]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const employeeId = localStorage.getItem("employeeId");
        if (!employeeId) throw new Error("Employee ID not found in localStorage");

        const response = await fetch(`http://localhost:3000/api/employees/${employeeId}`);
        if (!response.ok) throw new Error("Failed to fetch employee data");

        const data = await response.json();
        setEmployee({
          ...data.employee,
          images: data.employee.images || [],
        });

        // Retrieve stored check-in and sessions
        const storedCheckInTime = localStorage.getItem(`checkInTime_${employeeId}`);
        const storedSessions = JSON.parse(localStorage.getItem(`workSessions_${employeeId}`)) || [];
        
        if (storedCheckInTime) {
          setCheckInTime(Number(storedCheckInTime));
          setIsCheckedIn(true);
        }
        setWorkSessions(storedSessions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  useEffect(() => {
    let interval;
    if (isCheckedIn && checkInTime) {
      interval = setInterval(() => {
        const elapsed = Date.now() - checkInTime;
        setElapsedTime(formatTime(elapsed));
      }, 1000);
    } else {
      setElapsedTime("00:00:00");
    }
    return () => clearInterval(interval);
  }, [isCheckedIn, checkInTime]);

  const handleCheckIn = () => {
    const now = Date.now();
    setCheckInTime(now);
    setIsCheckedIn(true);
    localStorage.setItem(`checkInTime_${employee?.id}`, now);
  };

  const handleCheckOut = () => {
    const now = Date.now();
    if (!checkInTime) return;

    const sessionDuration = now - checkInTime;
    const newSession = {
      date: new Date().toLocaleDateString(),
      duration: formatTime(sessionDuration),
    };

    const updatedSessions = [...workSessions, newSession];
    setWorkSessions(updatedSessions);

    // Save sessions and reset state
    localStorage.setItem(`workSessions_${employee?.id}`, JSON.stringify(updatedSessions));
    localStorage.removeItem(`checkInTime_${employee?.id}`);

    setIsCheckedIn(false);
    setCheckInTime(null);
    setElapsedTime("00:00:00");
  };

  const formatTime = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* Profile Card */}
      <Card className="w-full md:w-1/4 p-6 flex flex-col items-center border rounded-2xl shadow-lg">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <img
              src={employee?.images[0] || "/default-profile.jpg"}
              alt="Profile"
              className="w-24 h-24 rounded-full mb-4 border-4 border-white shadow"
            />
            <h2 className="text-xl font-semibold">{employee?.name || "Unknown"}</h2>
            <div className="mt-2 text-gray-500 flex gap-2">
              <Clock className="w-5 h-5" /> <span>{elapsedTime}</span>
            </div>
            {isCheckedIn ? (
              <Button onClick={handleCheckOut} className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md">
                Check Out
              </Button>
            ) : (
              <Button onClick={handleCheckIn} className="mt-3 px-4 py-2 text-md border bg-green-100 text-green-700 border-green-400 rounded-lg shadow-md">
                Check In
              </Button>
            )}
          </>
        )}
      </Card>

      {/* Dashboard Content */}
      <div className="flex flex-col w-full md:w-3/4 gap-4">
        {/* Greeting Card */}
        <DashboardGreeting loading={loading} employee={employee} />

        {/* Check-in Reminder */}
        <Card className="p-4 rounded-2xl shadow-md flex justify-between items-center">
          <div className="flex items-center gap-3">
            <CalendarCheck className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-md font-semibold">Check-in Reminder</p>
              <p className="text-gray-500">Your shift is about to start</p>
            </div>
          </div>
          <p className="font-semibold text-gray-700">9:00 AM - 6:00 PM</p>
        </Card>

        {/* Work Sessions (Dynamic) */}
        <Card className="p-4 rounded-2xl shadow-md">
          <p className="text-md font-semibold">Work Sessions</p>
          {workSessions.length > 0 ? (
            <ul className="mt-3 text-sm text-gray-700">
              {workSessions.map((session, index) => (
                <li key={index} className="flex justify-between border-b py-2">
                  <span>{session.date}</span>
                  <span className="text-green-500">{session.duration}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">No work sessions recorded yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DashboardContent;
