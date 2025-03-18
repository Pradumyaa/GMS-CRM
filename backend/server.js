import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import { db } from './config/firebase.js'; // Import db from firebase-admin.js

// Load environment variables
dotenv.config();

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/images', imageRoutes);

// Add new chat routes
app.get('/api/chats/:chatId/messages', async (req, res) => {
  try {
    const { chatId } = req.params;
    const messagesSnapshot = await db.collection('chats').doc(chatId).collection('messages')
      .orderBy('timestamp', 'asc')
      .get();
    
    const messages = [];
    messagesSnapshot.forEach(doc => {
      messages.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toMillis() || Date.now() // Convert Firestore timestamp to milliseconds
      });
    });
    
    res.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.get('/api/channels', async (req, res) => {
  try {
    const channelsSnapshot = await db.collection('channels').get();
    const channels = [];
    
    channelsSnapshot.forEach(doc => {
      channels.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json({ channels });
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
});

// Socket.IO Connection Handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle user joining a specific chat (DM or channel)
  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat: ${chatId}`);
  });

  // Handle sending messages
  socket.on('send_message', async (messageData) => {
    try {
      const { chatId, message, senderId, senderName, timestamp } = messageData;
      
      // Create a unique message ID
      const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Prepare message object
      const newMessage = {
        id: messageId,
        text: message,
        sender: senderId,
        senderName: senderName,
        timestamp: timestamp,
        deleted: false
      };
      
      // Save to Firebase
      await db.collection('chats').doc(chatId).collection('messages').doc(messageId).set(newMessage);
      
      // Broadcast to all users in the chat
      io.to(chatId).emit('receive_message', newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  // For backward compatibility with your existing code
  socket.on('sendMessage', async ({ senderId, receiverId, text }) => {
    const chatId = [senderId, receiverId].sort().join('_'); // Unique chat ID
    
    // Join the chat room if not already joined
    socket.join(chatId);
    
    // Create message data
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const messageData = {
      id: messageId,
      senderId,
      receiverId,
      text,
      timestamp: Date.now(),
      deleted: false
    };

    // Store in Firebase
    await db.collection('chats').doc(chatId).collection('messages').doc(messageId).set(messageData);

    // Emit to the specific chat room
    io.to(chatId).emit('receive_message', messageData);
    
    // For backward compatibility
    io.emit(`receiveMessage_${receiverId}`, messageData);
  });
  
  // Handle message deletion
  socket.on('delete_message', async (data) => {
    try {
      const { chatId, messageId } = data;
      
      // Update message as deleted in Firebase
      await db.collection('chats').doc(chatId).collection('messages').doc(messageId).update({
        deleted: true
      });
      
      // Notify all users in the chat about the deletion
      io.to(chatId).emit('message_deleted', { chatId, messageId });
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  });
  
  // For backward compatibility with your existing code
  socket.on('deleteMessage', async ({ chatId, messageId }) => {
    try {
      // Update message as deleted in Firebase
      await db.collection('chats').doc(chatId).collection('messages').doc(messageId).update({
        deleted: true
      });
      
      // Notify using both new and old event patterns
      io.to(chatId).emit('message_deleted', { chatId, messageId });
      io.emit(`messageDeleted_${chatId}`, messageId);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start the server
const port = process.env.PORT || 10000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
