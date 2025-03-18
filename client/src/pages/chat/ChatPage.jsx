import React from "react";
import ChatHeader from "./ChatHeader";
import DirectMessages from "./DirectMessages";
import Channels from "./Channels";
import MessageContainer from "./MessageContainer";
import MessageInput from "./MessageInput";
import useChatStore from "@/store/chatSlice";

const ChatPage = () => {
  const { activeTab } = useChatStore();

  return (
    <div className="mt-auto h-[90dvh] max-h-screen bg-gradient-to-r from-blue-100 via-indigo-100 to-pink-100 flex flex-col md:flex-row p-8 shadow-lg rounded-lg overflow-hidden gap-4">
      <div className="w-full md:w-1/4 flex flex-col bg-white rounded-lg shadow-md">
        <ChatHeader />
        {activeTab === "direct" ? <DirectMessages /> : <Channels />}
      </div>
      <div className="flex flex-col flex-grow bg-gray-100 shadow-lg rounded-lg overflow-hidden p-2">
        <MessageContainer />
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatPage;
