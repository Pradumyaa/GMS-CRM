import React, { useEffect } from "react";
import useChatStore from "@/store/chatSlice";
import { UserCircle } from "lucide-react"; // For avatar placeholder

const DirectMessages = () => {
  const { employees, selectChat, selectedChat, fetchEmployees, currentUser } = useChatStore();
  
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return (
    <div className="p-4 flex-grow overflow-y-auto">
      {employees.length === 0 ? (
        <p className="text-gray-500 text-center">No employees found</p>
      ) : (
        <ul>
          {employees.map((employee) => (
            <li
              key={employee._id}
              className={`p-3 rounded-lg shadow-sm mb-2 cursor-pointer hover:bg-blue-100 flex items-center gap-3 ${
                selectedChat === employee._id ? "bg-blue-100" : "bg-gray-100"
              }`}
              onClick={() => selectChat(employee._id)}
            >
              {employee.profileImage ? (
                <img 
                  src={employee.profileImage} 
                  alt={employee.name} 
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <UserCircle className="w-8 h-8 text-gray-400" />
              )}
              <div>
                <p className="font-medium">{employee.name}</p>
                <p className="text-xs text-gray-500">{employee.department || employee.role || 'Employee'}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DirectMessages;