import React, { useState } from "react";
import { Send } from "lucide-react";
import useChatStore from "@/store/chatSlice";

const MessageInput = () => {
  const [text, setText] = useState("");
  const { selectedChat, sendMessage, employeeId, activeTab } = useChatStore();

  const handleSend = () => {
    if (!text.trim() || !selectedChat || !employeeId) return;
    
    console.log("handleSend called with:", { text, selectedChat, employeeId });
    
    // For direct messages, the chatId remains the original selectedChat
    // The sendMessage function will handle the ID concatenation internally
    const chatId = selectedChat;
    
    console.log("Final chatId used for sendMessage:", chatId);
    sendMessage(chatId, text.trim());
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t flex items-center gap-2 bg-white rounded-b-lg">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-32"
        rows={1}
        disabled={!selectedChat}
      />
      <button
        onClick={handleSend}
        disabled={!text.trim() || !selectedChat}
        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <Send size={20} />
      </button>
    </div>
  );
};

export default MessageInput;