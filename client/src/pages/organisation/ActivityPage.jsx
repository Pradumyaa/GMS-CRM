import React, { useState } from "react";
// import Navbar from "../../layout/Navbar";
import Sidebar from "../components/sidebar/Sidebar";

const ActivityAttendance = () => {
  const [attendanceStatus, setAttendanceStatus] = useState("Start Day"); // Example state

  const handleAttendanceClick = () => {
    setAttendanceStatus((prev) =>
      prev === "Start Day" ? "End Day" : "Start Day"
    );
  };

  return (
    <div className="flex">
      <div className="flex-1">
        {/* <Navbar /> */}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Employee Activity & Attendance
          </h1>
          <p className="mt-4 text-gray-600">
            Track the attendance and activities of employees.
          </p>

          <div className="mt-6 flex items-center space-x-4">
            <button
              onClick={handleAttendanceClick}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              {attendanceStatus}{" "}
              {/* Toggle between "Start Day" and "End Day" */}
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold">Leave Management</h2>
            <p className="mt-2 text-gray-600">Manage employee leaves here.</p>
            {/* Add Leave Management functionality */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityAttendance;
