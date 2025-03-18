import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import axios from "axios";

const SearchBar = ({ setFilteredEmployees, setSearchQuery, employees }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      if (query.trim() === "") {
        setFilteredEmployees(employees);
        setSearchQuery("");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:3000/api/employees/search",
          { name: query },
          { headers: { "Content-Type": "application/json" } }
        );
        setFilteredEmployees(response.data);
        setSearchQuery(query);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    const debounceTimer = setTimeout(fetchEmployees, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, setFilteredEmployees, setSearchQuery, employees]);

  return (
    <div className="relative w-80">
      <input
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
      />
      <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
    </div>
  );
};

export default SearchBar;
