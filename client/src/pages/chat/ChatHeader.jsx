import React from "react";
import useChatStore from "@/store/chatSlice";

const ChatHeader = () => {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="flex justify-between p-4 border-b bg-gray-50 rounded-2xl shadow-lg">
      <button
        className={`w-1/2 py-2 ${
          activeTab === "direct"
            ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
            : "text-gray-500"
        }`}
        onClick={() => setActiveTab("direct")}
      >
        Direct Messages
      </button>
      <button
        className={`w-1/2 py-2 ${
          activeTab === "channels"
            ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
            : "text-gray-500"
        }`}
        onClick={() => setActiveTab("channels")}
      >
        Channels
      </button>
    </div>
  );
};

export default ChatHeader;
