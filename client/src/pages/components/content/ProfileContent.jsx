import React, { useEffect, useState, useRef } from "react";

// Simple Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        {children}
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [profileImages, setProfileImages] = useState("/api/placeholder/80/80");
  const [uploading, setUploading] = useState(false); // Track upload status
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (employeeData && employeeData.images.length > 0) {
      console.log("Setting profile image URL:", employeeData.images[0]); // ✅ Debugging step
      setProfileImages(
        `${employeeData.images[0]}?timestamp=${new Date().getTime()}`
      );
    }
  }, [employeeData]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const employeeId = localStorage.getItem("employeeId");
        if (!employeeId) {
          console.error("Employee ID not found in localStorage");
          return;
        }

        // Fetch employee data from backend
        const response = await fetch(
          `http://localhost:3000/api/employees/${employeeId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch employee data");
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        const employee = {
          ...data.employee,
          images: data.employee.images || [], // Ensure images is an array
        };

        setEmployeeData(employee);
        setEditForm(employee);

        // ✅ Set Cloudinary Image URL with Cache Buster
        if (employee.images.length > 0) {
          setProfileImages(
            `${employee.images[0]}?timestamp=${new Date().getTime()}`
          );
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
    fetchEmployeeData();
  }, []);

  // Ensure React rerenders when data changes
  useEffect(() => {
    if (employeeData && employeeData.images.length > 0) {
      setProfileImages(
        `${employeeData.images[0]}?timestamp=${new Date().getTime()}`
      );
    }
  }, [employeeData]);

  const handleEditSubmit = () => {
    const updatedData = { ...editForm };
    localStorage.setItem("userData", JSON.stringify(updatedData));
    setEmployeeData(updatedData);
    setIsEditing(false);
  };
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("employeeId", localStorage.getItem("employeeId"));

      setUploading(true); // Start uploading

      try {
        const response = await fetch(
          "http://localhost:3000/api/images/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const result = await response.json();
        const newImageUrl = result.imageUrl; // ✅ Get Cloudinary image URL

        // ✅ Update Profile Image to Latest Upload
        setProfileImages(newImageUrl);

        // ✅ Update Employee Data with New Image URL
        setEmployeeData((prevData) => ({
          ...prevData,
          images: [newImageUrl, ...prevData.images], // Add new image at the start
        }));
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setUploading(false); // Stop uploading
      }
    }
  };

  if (!employeeData) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <>
      <div className="relative top-5 left-20">
        <h1 className="text-3xl font-semibold">Employee Details</h1>
      </div>
      <div className="sm:p-2 md:p-8 lg:p-14 xl:p-20">
        <div className="h-full bg-gradient-to-r from-blue-100 via-indigo-100 to-pink-100 p-6 md:p-8 rounded-xl shadow-lg overflow-hidden flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full">
            {/* Left Section */}
            <div className="col-span-1 flex flex-col items-center bg-gray-50 shadow-lg rounded-xl p-6 h-full">
              {/* Profile Image */}
              <div className="relative w-[60%] rounded-full border-4 border-gray-200 shadow-md">
                <img
                  src={profileImages}
                  alt="Profile"
                  className="rounded-full border-4 border-gray-200"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-1 bg-white p-2 rounded-full shadow-lg ring-2 ring-transparent hover:ring-[#5932EA] cursor-pointer transition-all duration-300 shadow-neutral-400"
                >
                  📸
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Name & Joining Date */}
              <h2 className="mt-4 text-md md:text-xl lg:text-3xl font-semibold text-gray-800 text-center">
                {employeeData.name || "N/A"}
              </h2>
              <p className="text-gray-500 text-md md:text-lg lg:text-xl text-center">
                Joined:{" "}
                {new Date(employeeData.joiningDate).toLocaleDateString() ||
                  "N/A"}
              </p>

              {/* Employee Badge */}
              <span className="mt-6 px-4 py-1 text-blue-600 bg-blue-100 rounded-full text-sm md:text-md lg:text-lg font-medium">
                {employeeData.jobTitle || "Employee"}
              </span>

              {/* Basic Information */}
              <div className="w-full mt-6 space-y-4 overflow-y-auto max-h-[70vh]">
                {[
                  { label: "Employee ID", value: employeeData.id || "N/A" },
                  { label: "Position", value: employeeData.position || "N/A" },
                  { label: "Manager", value: employeeData.manager || "N/A" },
                  {
                    label: "Department",
                    value: employeeData.department || "N/A",
                  },
                  { label: "Location", value: employeeData.location || "N/A" },
                  { label: "DOJ", value: employeeData.dateOfJoining || "N/A" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-md"
                  >
                    <h2 className="text-lg text-gray-500 mb-1">{item.label}</h2>
                    <p className="text-gray-800 font-semibold text-sm md:text-base">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Section */}
            <div className="col-span-3 grid grid-rows-2 gap-4 h-full">
              {/* Row 1 */}
              <div className="w-full p-8 bg-white rounded-xl shadow-lg flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-3xl font-semibold">Profile</h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-center text-md px-8 py-1 bg-[#5932EA] border-4 border-transparent text-white rounded-lg shadow-md transition-all duration-200 
             hover:bg-[#bbbbed] hover:text-[#5932EA] hover:font-semibold hover:border-4 hover:border-[#5932EA]"
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-900 flex-grow overflow-y-auto max-h-[60vh]">
                  <div className="space-y-3">
                    <p className="font-sans font-semibold text-xl">About Me</p>
                    <div className="bg-gray-100 p-3 rounded-lg">Content</div>
                  </div>

                  <div className="space-y-3">
                    <p className="font-sans font-semibold text-xl">Address</p>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      {employeeData.address?.street},{" "}
                      {employeeData.address?.city},{employeeData.address?.state}{" "}
                      {employeeData.address?.zipCode},{" "}
                      {employeeData.address?.country}
                    </div>
                  </div>

                  <div>
                    <p className="font-sans font-semibold text-xl">
                      Email Address
                    </p>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      {employeeData.email || "N/A"}
                    </div>
                  </div>

                  <div>
                    <p className="font-sans font-semibold text-xl">
                      Phone number
                    </p>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      {employeeData.phoneNumber || "N/A"}
                    </div>
                  </div>

                  <div>
                    <p className="font-sans font-semibold text-xl">UAN</p>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      {employeeData.uan || "********"}
                    </div>
                  </div>

                  <div>
                    <p className="font-sans font-semibold text-xl">Aadhaar</p>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      {employeeData.aadhaar || "********"}
                    </div>
                  </div>

                  <div>
                    <p className="font-sans font-semibold text-xl">PAN</p>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      {employeeData.pan || "********"}
                    </div>
                  </div>

                  <div>
                    <p className="font-sans font-semibold text-xl">Status</p>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      {employeeData.status || "Active"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="w-full p-6 mx-auto bg-white rounded-xl shadow-lg flex-grow">
                {/* Additional Content Here */}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Edit Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600">Full Name</label>
                <input
                  type="text"
                  value={editForm.name || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full p-3 border-2 border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-600">Job Title</label>
                <input
                  type="text"
                  value={editForm.jobTitle || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, jobTitle: e.target.value })
                  }
                  className="w-full p-3 border-2 border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-600">Email</label>
                <input
                  type="email"
                  value={editForm.email || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="w-full p-3 border-2 border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-600">Phone Number</label>
                <input
                  type="text"
                  value={editForm.phoneNumber || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phoneNumber: e.target.value })
                  }
                  className="w-full p-3 border-2 border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-600">Salary</label>
                <input
                  type="number"
                  value={editForm.salary || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, salary: e.target.value })
                  }
                  className="w-full p-3 border-2 border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-600">Status</label>
                <select
                  value={editForm.status || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                  className="w-full p-3 border-2 border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-600">Description</label>
                <textarea
                  value={editForm.description || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full p-3 border-2 border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border-2 border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleEditSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Save Changes
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default ProfilePage;
