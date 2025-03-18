import React from "react";

const Header = ({ name }) => (
  <div className="mb-6">
    <h1 className="text-3xl font-bold">Hello {name} 👋</h1>
    <p className="text-gray-600">All Employees</p>
  </div>
);

export default Header;
