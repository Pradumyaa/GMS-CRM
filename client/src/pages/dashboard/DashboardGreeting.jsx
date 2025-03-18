import React, { useState, useEffect } from "react";
import { Card } from "../components/ui/card";

const DashboardGreeting = ({ loading, employee }) => {
  const [greeting, setGreeting] = useState("Good Day");

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting("Good Morning");
      } else if (hour >= 12 && hour < 17) {
        setGreeting("Good Afternoon");
      } else if (hour >= 17 && hour < 21) {
        setGreeting("Good Evening");
      } else {
        setGreeting("Good Night");
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-4 rounded-2xl shadow-md">
      <p className="text-lg font-semibold">
        {loading ? "Loading..." : `${greeting}, ${employee?.name || "User"}!`}
      </p>
      <p className="text-gray-500">Have a great day!</p>
    </Card>
  );
};

export default DashboardGreeting;
