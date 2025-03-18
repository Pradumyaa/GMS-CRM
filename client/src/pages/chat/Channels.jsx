import React, { useEffect } from "react";
import useChatStore from "@/store/chatSlice";
import { Hash } from "lucide-react"; // Channel icon

const Channels = () => {
  const { channels, selectChat, selectedChat, fetchChannels } = useChatStore();
  
  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  return (
    <div className="p-4 flex-grow overflow-y-auto">
      {channels.length === 0 ? (
        <p className="text-gray-500 text-center">No channels available</p>
      ) : (
        <ul>
          {channels.map((channel) => (
            <li
              key={channel.id}
              className={`p-3 rounded-lg shadow-sm mb-2 cursor-pointer hover:bg-blue-100 flex items-center gap-3 ${
                selectedChat === channel.id ? "bg-blue-100" : "bg-gray-100"
              }`}
              onClick={() => selectChat(channel.id)}
            >
              <Hash className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium">{channel.name}</p>
                {channel.description && (
                  <p className="text-xs text-gray-500">{channel.description}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Channels;