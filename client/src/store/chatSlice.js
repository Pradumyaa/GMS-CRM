import { create } from "zustand";
import { io } from "socket.io-client";
import axios from "axios";

// Initialize Socket.IO client
const socket = io("http://localhost:3000"); // Change to match your server URL

const useChatStore = create((set, get) => ({
  employeeId: null,  // ✅ Store employeeId separately
  activeTab: "direct", // 'direct' or 'channels'
  employees: [],
  channels: [],
  selectedChat: null,
  messages: {},
  loading: false,
  error: null,

// Replace the existing initialize function with this improved version

initialize: async () => {
  try {
    set({ loading: true });

    // Retrieve employeeId from localStorage
    const storedEmployeeId = localStorage.getItem("employeeId");
    console.log("Retrieved employeeId from localStorage:", storedEmployeeId);

    if (!storedEmployeeId) {
      throw new Error("No employeeId found in localStorage");
    }

    // Important: Set the employeeId before fetching data
    set({ employeeId: storedEmployeeId, loading: false });
    
    // Now load employees and channels
    await get().fetchEmployees();
    await get().fetchChannels();
    
    // Set up socket listeners AFTER employeeId is set
    get().setupSocketListeners();
    
    console.log("Chat store initialized successfully");
  } catch (error) {
    console.error("Failed to initialize chat store:", error);
    set({ error: error.message, loading: false });
  }
},

  // Fetch employees from API
  fetchEmployees: async () => {
    try {
      set({ loading: true });
      const response = await axios.get("http://localhost:3000/api/employees");
      console.log("API Response:", response.data); // Log response

      let employeesArray;

      // Check different possible response formats
      if (Array.isArray(response.data)) {
        employeesArray = response.data;
      } else if (response.data && Array.isArray(response.data.employees)) {
        employeesArray = response.data.employees;
      } else if (response.data && typeof response.data === "object") {
        employeesArray = [response.data];
      } else {
        employeesArray = [];
      }

      // Ensure each employee has an _id property
      employeesArray = employeesArray.map(emp => ({
        ...emp,
        _id: emp._id || emp.id || emp.employeeId
      }));

      console.log("Processed employees array:", employeesArray);
      set({ employees: employeesArray, loading: false });
    } catch (error) {
      console.error("Error fetching employees:", error);
      set({ error: "Failed to fetch employees", employees: [], loading: false });
    }
  },
  
  // Fetch channels from API
  fetchChannels: async () => {
    try {
      set({ loading: true });
      const response = await axios.get("http://localhost:3000/api/channels");
      set({ channels: response.data.channels, loading: false });
    } catch (error) {
      console.error("Error fetching channels:", error);
      set({ error: "Failed to fetch channels", loading: false });
    }
  },

  // Fetch messages for a specific chat from Firebase
  fetchMessages: async (chatId) => {
    try {
      set({ loading: true });
      
      const response = await axios.get(`http://localhost:3000/api/chats/${chatId}/messages`);
      
      set(state => ({
        messages: {
          ...state.messages,
          [chatId]: response.data.messages
        },
        loading: false
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
      set({ error: "Failed to fetch messages", loading: false });
    }
  },

  // Set active tab
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Select a chat and join the Socket.IO room
  selectChat: (chatId) => {
    // Leave previous chat if any
    const prevChat = get().selectedChat;
    if (prevChat) {
      socket.emit("leave_chat", prevChat);
    }
    
    // Join new chat
    socket.emit("join_chat", chatId);
    
    // Set selected chat and fetch messages
    set({ selectedChat: chatId });
    get().fetchMessages(chatId);
  },

  // Send a message via Socket.IO
  // This is the fixed sendMessage function for your chatSlice.js
// Replace the existing sendMessage function with this one

sendMessage: (chatId, text) => {
  console.log("sendMessage called with:", { chatId, text });
  
  const employeeId = get().employeeId;
  const employees = get().employees;
  const activeTab = get().activeTab;
  
  console.log("Current state:", { employeeId, activeTab, employeesCount: employees.length });
  
  if (!employeeId) {
    console.error("Missing employeeId");
    return;
  }
  
  if (!text.trim()) {
    console.error("Message text is empty");
    return;
  }
  
  if (!chatId) {
    console.error("Missing chatId");
    return;
  }
  
  // Find the current employee to get their name
  const currentEmployee = employees.find(emp => emp._id === employeeId || emp.id === employeeId);
  console.log("Current employee:", currentEmployee);
  
  // Check if chat is direct message or channel
  if (activeTab === "direct") {
    // For direct messages, use the sorted IDs
    // IMPORTANT FIX: Only use employeeId and chatId, not the already combined ID
    const actualChatId = [employeeId, chatId].sort().join('_');
    console.log("Sending direct message with actualChatId:", actualChatId);
    
    // Direct message
    const messageData = {
      senderId: employeeId,
      receiverId: chatId, // FIXED: This should be just chatId, not a combined ID
      text,
      timestamp: Date.now()
    };
    
    console.log("Emitting 'sendMessage' event:", messageData);
    socket.emit("sendMessage", messageData);
    
    // Optimistically update local state
    const newMessage = {
      id: `temp-${Date.now()}`,
      ...messageData
    };
    
    set(state => {
      const existingMessages = state.messages[actualChatId] || [];
      return {
        messages: {
          ...state.messages,
          [actualChatId]: [...existingMessages, newMessage]
        }
      };
    });
  } else {
    // Channel message - this part remains the same
    const messageData = {
      chatId,
      message: text,
      senderId: employeeId,
      senderName: currentEmployee ? (currentEmployee.name || "Unknown") : "Unknown",
      timestamp: Date.now()
    };
    
    console.log("Emitting 'send_message' event:", messageData);
    socket.emit("send_message", messageData);
    
    // Optimistically update local state
    const newMessage = {
      id: `temp-${Date.now()}`,
      text: messageData.message,
      senderId: messageData.senderId,
      senderName: messageData.senderName,
      timestamp: messageData.timestamp
    };
    
    set(state => {
      const existingMessages = state.messages[chatId] || [];
      return {
        messages: {
          ...state.messages,
          [chatId]: [...existingMessages, newMessage]
        }
      };
    });
  }
},
  // Delete a message via Socket.IO
  deleteMessage: (chatId, messageId) => {
    socket.emit("deleteMessage", { chatId, messageId });
  },

 // Replace the existing setupSocketListeners function with this improved version

setupSocketListeners: () => {
  const employeeId = get().employeeId;
  
  if (!employeeId) {
    console.error("Cannot set up socket listeners: employeeId is missing");
    return;
  }
  
  console.log(`Setting up socket listeners for employee ${employeeId}`);
  
  // Remove any existing listeners to prevent duplicates
  socket.off("receive_message");
  socket.off(`receiveMessage_${employeeId}`);
  socket.off("message_deleted");
  
  // Handle receiving messages - new format
  socket.on("receive_message", (message) => {
    console.log("Received message via 'receive_message':", message);
    
    // Ensure the message has the essential fields
    if (!message.senderId || (!message.text && !message.message)) {
      console.error("Received invalid message format:", message);
      return;
    }
    
    // Normalize the message format
    const normalizedMessage = {
      id: message.id || message._id || `server-${Date.now()}`,
      senderId: message.senderId,
      text: message.text || message.message,
      timestamp: message.timestamp || Date.now(),
      receiverId: message.receiverId
    };
    
    // Determine the chat ID
    const chatId = message.chatId || 
      [message.senderId, message.receiverId || employeeId].sort().join('_');
    
    console.log(`Adding message to chat ${chatId}:`, normalizedMessage);
    
    set(state => {
      const chatMessages = state.messages[chatId] || [];
      
      // Check if the message already exists (to avoid duplicates)
      const messageExists = chatMessages.some(msg => 
        msg.id === normalizedMessage.id ||
        (msg.timestamp === normalizedMessage.timestamp && msg.senderId === normalizedMessage.senderId)
      );
      
      if (messageExists) {
        console.log("Message already exists, skipping:", normalizedMessage);
        return state;
      }
      
      return {
        messages: {
          ...state.messages,
          [chatId]: [...chatMessages, normalizedMessage]
        }
      };
    });
  });
  
  // Handle receiving messages - old format
  socket.on(`receiveMessage_${employeeId}`, (message) => {
    console.log(`Received message via 'receiveMessage_${employeeId}':`, message);
    
    // Normalize the message format
    const normalizedMessage = {
      id: message.id || message._id || `server-${Date.now()}`,
      senderId: message.senderId,
      text: message.text || message.message,
      timestamp: message.timestamp || Date.now(),
      receiverId: message.receiverId
    };
    
    // For direct messages, use the sorted IDs
    const chatId = [message.senderId, message.receiverId].sort().join('_');
    
    console.log(`Adding message to chat ${chatId}:`, normalizedMessage);
    
    set(state => {
      const chatMessages = state.messages[chatId] || [];
      return {
        messages: {
          ...state.messages,
          [chatId]: [...chatMessages, normalizedMessage]
        }
      };
    });
  });
  
  // Handle message deletion
  socket.on("message_deleted", ({ chatId, messageId }) => {
    console.log(`Message deleted in chat ${chatId}:`, messageId);
    
    set(state => {
      const chatMessages = state.messages[chatId] || [];
      const updatedMessages = chatMessages.map(msg => 
        msg.id === messageId ? { ...msg, deleted: true } : msg
      );
      
      return {
        messages: {
          ...state.messages,
          [chatId]: updatedMessages
        }
      };
    });
  });
  
  // Log successful setup
  console.log("Socket listeners have been set up successfully");
},

  // Cleanup function
  cleanup: () => {
    socket.disconnect();
  }
}));

export default useChatStore;