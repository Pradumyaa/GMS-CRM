import React, { useState, useEffect } from "react";
import axios from "axios";

const AddEmployeeModal = ({
  isOpen,
  onClose,
  employeeData = {},
  setEmployeeData,
  onSave,
  isEditing,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize default values when opening the modal
  useEffect(() => {
    if (isOpen) {
      // Ensure proper initialization of employeeData with defaults
      setEmployeeData(prevData => ({
        ...prevData,
        // Explicitly ensure status is set with a default value
        status: prevData.status || "Active",
        // Ensure address is properly initialized
        address: prevData.address || { 
          street: "", 
          city: "", 
          state: "", 
          zipCode: "", 
          country: "" 
        }
      }));
    }
  }, [isOpen, setEmployeeData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Generate a systematic employee ID based on department and current timestamp
  const generateEmployeeId = () => {
    const timestamp = new Date().getTime().toString().slice(-4);
    const department =
      employeeData.jobTitle?.split(" ")[0]?.toUpperCase()?.slice(0, 3) || "EMP";
    return `${department}${timestamp}`;
  };

  // Generate a random password meeting security requirements
  const generatePassword = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "@#$%^&*";

    const allChars = lowercase + uppercase + numbers + symbols;
    let password = "";

    // Ensure at least one of each type
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Add 4 more random characters
    for (let i = 0; i < 4; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData(prevData => ({
      ...prevData,
      address: { 
        ...(prevData.address || {}), 
        [name]: value 
      }
    }));
  };

  const validateEmployeeData = (data) => {
    console.log("Validating data:", data);
    
    const requiredFields = [
      "name",
      "jobTitle",
      "description",
      "salary",
      "phoneNumber",
      "email",
      "status",
    ];
  
    // Check missing fields
    const missingFields = requiredFields.filter(
      (field) => !data[field] || data[field].toString().trim() === ""
    );
  
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }
  
    // Check salary (should be a valid number)
    if (isNaN(Number(data.salary)) || Number(data.salary) <= 0) {
      throw new Error("Salary must be a valid positive number.");
    }
  
    // Validate phone number (allows country codes)
    if (!/^\+?[\d\s-]{10,}$/.test(data.phoneNumber)) {
      throw new Error("Invalid phone number format.");
    }
  
    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new Error("Invalid email format.");
    }
  
    // Ensure address is properly initialized
    if (!data.address || typeof data.address !== "object") {
      throw new Error("Address information is missing.");
    }
  
    const addressFields = ["street", "city", "state", "zipCode", "country"];
    const missingAddressFields = addressFields.filter(
      (field) => !data.address[field] || data.address[field].toString().trim() === ""
    );
  
    if (missingAddressFields.length > 0) {
      throw new Error(`Missing address fields: ${missingAddressFields.join(", ")}`);
    }
  
    return true;
  };
  
  const formatEmployeeData = (data) => {
    // Generate credentials for new employees
    const credentials = !isEditing
      ? {
          employeeId: generateEmployeeId(),
          password: generatePassword()
        }
      : {};

    // Ensure status is explicitly set
    return {
      ...data,
      ...credentials,
      salary: Number(data.salary),
      status: data.status || "Active", // Ensure status is set here
      address: {
        street: data.address?.street || "",
        city: data.address?.city || "",
        state: data.address?.state || "",
        zipCode: data.address?.zipCode || "",
        country: data.address?.country || "",
      },
      images: data.images || [],
      joiningDate: new Date(),
    };
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      
      // Log data before validation for debugging
      console.log("Employee Data Before Validation:", JSON.stringify(employeeData, null, 2));

      // Ensure status is explicitly set before validation
      const dataToValidate = {
        ...employeeData,
        status: employeeData.status || "Active"
      };

      // Validate employee data
      validateEmployeeData(dataToValidate);
  
      // Format employee data
      const formattedData = formatEmployeeData(dataToValidate);
  
      // Determine the API endpoint and method
      const apiEndpoint = isEditing
        ? `http://localhost:3000/api/employees/${employeeData.employeeId}`
        : "http://localhost:3000/api/employees";
      const apiMethod = isEditing ? axios.put : axios.post;
  
      // Log the data being sent to API for debugging
      console.log("Sending to API:", JSON.stringify(formattedData, null, 2));
      
      // Make the API request
      const response = await apiMethod(apiEndpoint, formattedData);
  
      // Handle success response
      if ([200, 201].includes(response.status)) {
        onSave();
        onClose();
      } else {
        throw new Error("Unexpected server response");
      }
    } catch (error) {
      console.error("Error saving employee:", error);
      alert(
        error.response?.data?.message ||
        error.message ||
        "Error saving employee."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-70 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl border-2 border-gray-600">
        <h2 className="text-3xl font-semibold mb-6 text-center text-[#5932ea]">
          {isEditing ? "Edit Employee" : "Add Employee"}
        </h2>
        {/* Add debug info to help troubleshoot */}
        <div className="mb-4 text-xs text-gray-500">
          Status: {employeeData.status || "Not set"}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Basic Information */}
          {[
            "name",
            "jobTitle",
            "description",
            "salary",
            "phoneNumber",
            "email",
          ].map((field) => (
            <input
              key={field}
              type={field === "salary" ? "number" : "text"}
              name={field}
              placeholder={
                field.charAt(0).toUpperCase() +
                field
                  .slice(1)
                  .replace(/([A-Z])/g, " $1")
                  .trim()
              }
              value={employeeData[field] || ""}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-400 rounded-lg bg-gray-200 text-black focus:ring-2 focus:ring-[#5932ea] focus:outline-none focus:border-[#5932ea] transition"
            />
          ))}

          {/* Resume Upload */}
          <input
            type="text"
            name="resume"
            placeholder="Resume URL"
            value={employeeData.resume || ""}
            onChange={handleChange}
            className="w-full p-4 border-2 border-gray-400 rounded-lg bg-gray-200 text-black focus:ring-2 focus:ring-[#5932ea] focus:outline-none focus:border-[#5932ea] transition"
          />

          {/* Status Selection - Make more prominent */}
          <select
            name="status"
            value={employeeData.status || "Active"}
            onChange={handleChange}
            className="w-full p-4 border-2 border-gray-400 rounded-lg bg-gray-200 text-black focus:ring-2 focus:ring-[#5932ea] focus:outline-none focus:border-[#5932ea] transition"
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Address Fields */}
          <div className="col-span-2">
            <h3 className="text-xl font-semibold text-[#5932ea] mb-2">
              Address
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {["street", "city", "state", "zipCode", "country"].map(
                (field) => (
                  <input
                    key={field}
                    type="text"
                    name={field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={employeeData.address?.[field] || ""}
                    onChange={handleAddressChange}
                    className="w-full p-4 border-2 border-gray-400 rounded-lg bg-gray-200 text-black focus:ring-2 focus:ring-[#5932ea] focus:outline-none focus:border-[#5932ea] transition"
                  />
                )
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2 bg-gray-300 hover:bg-red-500 text-gray-800 rounded-lg border-2 border-gray-400 hover:text-white transition duration-200 transform hover:scale-100 hover:shadow-lg disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="px-6 py-2 bg-gray-300 hover:bg-[#5932ea] text-gray-800 rounded-lg border-2 border-gray-400 hover:text-white transition duration-200 transform hover:scale-100 hover:shadow-lg disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
              ? "Save Changes"
              : "Add Employee"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;