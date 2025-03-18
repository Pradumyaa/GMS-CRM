const EmployeeTable = ({ employees, filteredEmployees, onEdit, onDelete }) => {
  if (!filteredEmployees.length) {
    return (
      <p className="text-gray-500 text-center py-4">No employees found.</p>
    );
  }
  
  const EmployeeRow = ({ employee, onEdit, onDelete }) => (
    <tr className="border-b text-gray-700 hover:bg-gray-50">
      <td className="p-4 whitespace-nowrap">{employee.name}</td>
      <td className="p-4 whitespace-nowrap">{employee.branch}</td>
      <td className="p-4 whitespace-nowrap">{employee.phoneNumber}</td>
      <td className="p-4 whitespace-nowrap">{employee.email}</td>
      <td className="p-4 whitespace-nowrap">{employee.location}</td>
      <td className="p-4 whitespace-nowrap">
        <button
          className={`px-3 py-1 rounded-md font-medium border text-sm ${
            employee.status === "Active"
              ? "bg-green-100 text-green-700 border-green-400"
              : "bg-red-100 text-red-700 border-red-400"
          }`}
        >
          {employee.status}
        </button>
      </td>
      <td className="p-4 whitespace-nowrap">
        <button
          className="bg-yellow-500 text-white px-3 py-1 rounded-md mr-2"
          onClick={() => onEdit(employee)} // ✅ Opens modal for editing
        >
          Edit
        </button>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded-md"
          onClick={() => onDelete(employee._id)} // ✅ Delete button now works
        >
          Delete
        </button>
      </td>
    </tr>
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-4 overflow-x-auto">
      <table className="w-full min-w-max text-left border-collapse">
        <thead>
          <tr className="text-gray-600 font-semibold bg-gray-100">
            {[
              "Customer Name",
              "Branch",
              "Phone Number",
              "Email",
              "Location",
              "Status",
              "Actions",
            ].map((header) => (
              <th key={header} className="p-4 text-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <EmployeeRow
              key={employee._id}
              employee={employee}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
      <p className="text-gray-500 text-sm mt-4">
        Showing {filteredEmployees.length} of {employees.length} entries
      </p>
    </div>
  );
};

export default EmployeeTable;
