import React, { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const AttendanceCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Sample Dynamic Attendance Data (Could Be Fetched from API)
  const attendanceData = {
    "2025-02-03": "absent-red",
    "2025-02-04": "present",
    "2025-02-05": "present",
    "2025-02-06": "present",
    "2025-02-07": "present",
    "2025-02-10": "present",
    "2025-02-11": "present",
    "2025-02-12": "absent-red",
    "2025-02-13": "present",
    "2025-02-14": "present",
    "2025-02-17": "present",
    "2025-02-18": "absent-red",
    "2025-02-19": "present",
    "2025-02-20": "highlighted",
    "2025-02-21": "present",
  };

  // Function to Generate Days Dynamically
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    // Fill Empty Cells for Correct Alignment
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Fill Calendar with Actual Days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      const status = attendanceData[dateString] || "default";
      days.push({ 
        day, 
        status, 
        dateString 
      });
    }

    return days;
  };

  // Change Month Dynamically
  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Format Month & Year for Display
  const formatMonthYear = (date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-6 bg-gray-100">
      {/* Calendar Header with Dynamic Month & Year */}
      <div className="flex items-center justify-between w-full max-w-4xl mb-6">
        <button onClick={() => changeMonth(-1)} className="p-3 rounded-full hover:bg-gray-200">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar className="h-6 w-6 text-blue-500" />
          <span className="text-lg font-semibold">{formatMonthYear(currentDate)}</span>
        </div>
        <button onClick={() => changeMonth(1)} className="p-3 rounded-full hover:bg-gray-200">
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-lg p-1 w-full h-full max-w-4xl bg-red-100 shadow-md">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 text-center font-semibold text-gray-700 text-sm bg-white ">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
            <div key={day} className="p-2">{day}</div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 text-center">
          {getDaysInMonth().map((dayObj, index) => {
            if (!dayObj) {
              return <div key={`empty-${index}`} className="p-2
              "></div>;
            }

            let bgColor = "";
            let textColor = "text-gray-700";
            let additionalClasses = "rounded-lg p-3 text-sm font-medium";

            if (dayObj.status === "absent-red") {
              bgColor = "bg-red-100";
              textColor = "text-red-600";
            } else if (dayObj.status === "present") {
              bgColor = "bg-green-100";
              textColor = "text-green-600";
            } else if (dayObj.status === "highlighted") {
              bgColor = "bg-blue-500 text-white font-bold";
              additionalClasses = "rounded-full p-4";
            }

            return (
              <div 
                key={dayObj.dateString} 
                className={`p-4 flex justify-center items-center ${bgColor} ${textColor} ${additionalClasses}`}
              >
                {dayObj.day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;
