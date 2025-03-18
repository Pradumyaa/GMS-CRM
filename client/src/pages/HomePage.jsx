import React from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import Sidebar from "./components/sidebar/Sidebar.jsx";
import DashboardContent from "./dashboard/DashboardContent.jsx"
import EmployeeList from "./organisation/EmployeeList.jsx";
import ActivityPage from "./organisation/ActivityPage";
// import HelpContent from "../components/content/HelpContent";
import IncomeContent from "./components/content/IncomeContent.jsx"
import ProfileContent from "./components/content/ProfileContent";
import AllProductsContent from "./product/AllProductsContent";
import CategoriesContent from "./product/CategoriesContent";
import OrdersContent from "./product/OrdersContent";
import AttendanceCalendar from "./attendance/AttendanceCalender.jsx"
import ChatPage from "./chat/ChatPage.jsx";

const HomePage = () => {
  const location = useLocation();
  const defaultItem = location.state?.selectedItem || "profile"; // Check for selectedItem from state
  const [selectedItem, setSelectedItem] = React.useState(defaultItem);

  const handleItemSelection = (itemKey) => {
    setSelectedItem(itemKey);
  };

  const contentMap = {
    dashboard: <DashboardContent />,
    employeeList: <EmployeeList />,
    activityTracker: <ActivityPage />,
    help: <AttendanceCalendar />,
    income: <IncomeContent />,
    profile: <ProfileContent />,
    allProducts: <AllProductsContent />,
    categories: <CategoriesContent />,
    orders: <OrdersContent />,
    chat: <ChatPage />,
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar selectedItem={selectedItem} onItemSelect={handleItemSelection} />

      {/* Main content */}
      <div className="flex-1 min-h-screen overflow-auto">
        <div className="p-6">
          {/* Render content based on selected item */}
          {contentMap[selectedItem] || (
            <div className="p-8">Content for {selectedItem}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
