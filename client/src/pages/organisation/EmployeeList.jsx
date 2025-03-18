import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar.jsx";
import EmployeeTable from "./employee/EmployeeTable.jsx";
import Pagination from "../components/Pagination.jsx";
import AddEmployeeModal from "./employee/AddEmployeeModal.jsx";

const EmployeeList = () => {
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // ✅ Track editing mode
  const [selectedEmployee, setSelectedEmployee] = useState(null); // ✅ Store selected employee
  const [sortOrder, setSortOrder] = useState("newest"); // Default sort order

  const handleSortChange = (event) => {
    const order = event.target.value;
    setSortOrder(order);

    const sortedEmployees = [...filteredEmployees].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0); // Default to earliest date
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0); // Default to earliest date

      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredEmployees(sortedEmployees);
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/employees");
        setEmployees(response.data.employees || []);
        setFilteredEmployees(response.data.employees || []);
        setTotalPages(Math.ceil(response.data.employees.length / itemsPerPage));
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee); // ✅ Set employee data
    setIsEditing(true); // ✅ Set edit mode
    setIsModalOpen(true); // ✅ Open modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedEmployee(null); // ✅ Reset employee data when closing modal
  };

  const handleDelete = async (employeeId) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;

    try {
      await axios.delete(`http://localhost:3000/api/employees/${employeeId}`);
      setEmployees((prev) => prev.filter((emp) => emp._id !== employeeId));
      setFilteredEmployees((prev) =>
        prev.filter((emp) => emp._id !== employeeId)
      );
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee. Try again.");
    }
  };

  const currentEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold mb-4">Hello Sriram 👋</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold">All Employees</h2>
        <p className="text-green-500 font-medium cursor-pointer">
          Active Members
        </p>

        <div className="flex justify-between items-center mt-4">
          <SearchBar
            setFilteredEmployees={setFilteredEmployees}
            setSearchQuery={setSearchQuery}
            employees={employees}
          />
          <div className="flex items-center gap-4">
            <select
              className="border p-2 rounded-md text-gray-600"
              value={sortOrder}
              onChange={handleSortChange}
            >
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Sort by: Oldest</option>
            </select>
            <button
              onClick={() => {
                setIsEditing(false); // ✅ Ensure it's not editing
                setSelectedEmployee(null);
                setIsModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
        <EmployeeTable
          employees={currentEmployees}
          filteredEmployees={filteredEmployees}
          searchQuery={searchQuery}
          onEdit={handleEdit}
          onDelete={handleDelete} // ✅ Now delete button works
        />
      </div>

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {isModalOpen && (
        <AddEmployeeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          employeeData={selectedEmployee || {}}
          setEmployeeData={setSelectedEmployee}
          onSave={() => window.location.reload()} // ✅ Refresh after save
          isEditing={isEditing} // ✅ Pass editing state
        />
      )}
    </div>
  );
};

export default EmployeeList;
