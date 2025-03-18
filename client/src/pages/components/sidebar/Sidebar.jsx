import { useEffect, useState } from "react";
import { FaChevronRight, FaChevronDown, FaBars } from "react-icons/fa";
import { MdSettings, MdLogout } from "react-icons/md";
import { RiDashboardHorizontalLine } from "react-icons/ri";
import {
  FaHome,
  FaBox,
  FaUserAlt,
  FaWallet,
  FaComments as FaChat,
  FaRegCalendarAlt
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/GetMaxLogo.svg"

const Sidebar = ({ selectedItem, onItemSelect }) => {
  const [openDropdown, setOpenDropdown] = useState("");
  const [user, setUser] = useState({ name: "Guest", isAdmin: false });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const employeeId = localStorage.getItem("employeeId");
      if (employeeId) {
        try {
          const response = await fetch(
            `http://localhost:3000/api/employees/isAdminOrNot/${employeeId}`
          );
          if (!response.ok) throw new Error("Failed to fetch user data");
          const data = await response.json();
          setUser({
            name: data.name || "Guest",
            isAdmin: data.isAdmin || false,
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, []);

  const navigationItems = [
    { label: "Dashboard", icon: <FaHome />, key: "dashboard" },
    { label: "Profile", icon: <FaUserAlt />, key: "profile" },
    {
      label: "Product",
      icon: <FaBox />,
      hasDropdown: true,
      key: "product",
      subItems: [
        { label: "All Products", key: "allProducts" },
        { label: "Categories", key: "categories" },
        { label: "Orders", key: "orders" },
      ],
    },
    { label: "Income", icon: <FaWallet />, key: "income" },
    ...(user.isAdmin
      ? [
          {
            label: "Organisation",
            icon: <RiDashboardHorizontalLine />,
            hasDropdown: true,
            key: "organisation",
            subItems: [
              { label: "Employee List", key: "employeeList" },
              { label: "Activity Tracker", key: "activityTracker" },
            ],
          },
        ]
      : []),
    { label: "Attendance", icon: <FaRegCalendarAlt />, key: "help" },
    { label: "Chat", icon: <FaChat />, key: "chat" },
  ];

  const handleItemClick = (item) => {
    if (item.hasDropdown) {
      setOpenDropdown(openDropdown === item.label ? "" : item.label);
    } else {
      setOpenDropdown("");
      if (onItemSelect) onItemSelect(item.key);
    }
  };

  const handleSubItemClick = (parentLabel, subItemKey) => {
    setOpenDropdown(parentLabel);
    if (onItemSelect) onItemSelect(subItemKey);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-4 text-gray-600 hover:text-black"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FaBars size={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-white shadow-lg border-r border-gray-400 fixed md:relative transition-all duration-300 flex flex-col h-screen ${
          isSidebarOpen ? "w-[250px]" : "w-0 md:w-[250px]"
        }`}
      >
        {/* Sidebar Content - Scrollable */}
        <div className="p-7 space-y-8 flex-1 overflow-y-auto">
          <div className="flex items-center">
            <img src={logo} alt="Company Logo" />
          </div>

          <nav className="space-y-4">
            {navigationItems.map((item) => (
              <div key={item.key}>
                <button
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex justify-between items-center gap-3 py-2 px-3 rounded-md transition-all duration-300 ${
                    selectedItem === item.key || openDropdown === item.label
                      ? "bg-[#5932EA] text-white"
                      : "text-[#9197b3] hover:text-gray-950 hover:font-bold hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.hasDropdown &&
                    (openDropdown === item.label ? (
                      <FaChevronDown className="h-4 w-4" />
                    ) : (
                      <FaChevronRight className="h-4 w-4" />
                    ))}
                </button>

                {item.hasDropdown && openDropdown === item.label && (
                  <div className="mt-1 p-2 rounded-md space-y-2">
                    {item.subItems.map((subItem) => (
                      <button
                        key={subItem.key}
                        onClick={() =>
                          handleSubItemClick(item.label, subItem.key)
                        }
                        className={`w-full flex justify-start items-center px-3 py-2 rounded-md transition-all ${
                          selectedItem === subItem.key
                            ? "bg-gray-300 text-black font-semibold"
                            : "text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        <FaChevronRight className="h-4 w-4 text-gray-500 mr-2" />
                        <span>{subItem.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Section - Fixed */}
        <div className="p-4 bg-white border-t border-gray-300">
          <div className="flex items-center justify-between w-full p-4">
            <button
              onClick={() => {
                localStorage.removeItem("employeeId");
                localStorage.removeItem("userData");
                navigate("/login");
              }}
              className="w-full flex items-center gap-2 text-gray-700 hover:text-blue-600 hover:font-semibold"
            >
              <MdLogout />
              Logout
            </button>
            <button className="w-full text-left text-gray-700 hover:text-blue-600 hover:font-semibold">
              Settings
            </button>
          </div>
          <div className="mt-3 text-center text-sm text-gray-500">
            <p>&copy; Dashboard. All rights reserved.</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;


// export default Sidebar;
