import React from "react";

// Card Component
export const Card = ({ children, className }) => {
  return (
    <div className={`bg-white p-4 rounded-2xl shadow-md border ${className}`}>
      {children}
    </div>
  );
};

// Card Content Component
export const CardContent = ({ children }) => {
  return <div className="p-4">{children}</div>;
};