import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Configuration
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-key';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [FRONTEND_URL, 'http://localhost:5173'];
const MAX_MESSAGE_TTL = parseInt(process.env.MAX_MESSAGE_TTL) || 86400000; // 24 hours

// Email service
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

// In-memory stores (ephemeral, no persistence)
const messageQueue = new Map(); // deviceId -> [messages]
const connectionMap = new Map(); // deviceId -> socketId
const deviceSessions = new Map(); // deviceId -> { identityKey, lastSeen }
const pendingMagicLinks = new Map(); // token -> { email, deviceId, expires }

// Cleanup expired messages and sessions
setInterval(() => {
  const now = Date.now();

  // Clean expired messages
  for (const [deviceId, messages] of messageQueue.entries()) {
    const validMessages = messages.filter(msg =>
      (now - msg.timestamp) < MAX_MESSAGE_TTL
    );
    if (validMessages.length === 0) {
      messageQueue.delete(deviceId);
    } else if (validMessages.length !== messages.length) {
      messageQueue.set(deviceId, validMessages);
    }
  }

  // Clean expired magic links
  for (const [token, data] of pendingMagicLinks.entries()) {
    if (now > data.expires) {
      pendingMagicLinks.delete(token);
    }
  }

  // Clean inactive device sessions (older than 30 days)
  for (const [deviceId, session] of deviceSessions.entries()) {
    if (now - session.lastSeen > 30 * 24 * 60 * 60 * 1000) {
      deviceSessions.delete(deviceId);
      messageQueue.delete(deviceId);
    }
  }
}, 60000); // Run every minute

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST'],
    credentials: true
  },
  maxHttpBufferSize: 10e6, // 10MB for file attachments
  pingTimeout: 60000,
  pingInterval: 25000
});

// Socket.IO middleware for authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication required'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.deviceId = decoded.deviceId;
    socket.identityKey = decoded.identityKey;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  const { deviceId, identityKey } = socket;

  console.log(`Device connected: ${deviceId}`);

  // Register connection
  connectionMap.set(deviceId, socket.id);

  // Update device session
  deviceSessions.set(deviceId, {
    identityKey,
    lastSeen: Date.now()
  });

  // Send queued messages
  const queuedMessages = messageQueue.get(deviceId) || [];
  if (queuedMessages.length > 0) {
    queuedMessages.forEach(msg => {
      socket.emit('message', msg);
    });
    messageQueue.delete(deviceId);
  }

  // Handle outgoing messages
  socket.on('send-message', (data) => {
    const { recipientDeviceId, encryptedPayload, messageId, groupId } = data;

    const message = {
      messageId,
      senderDeviceId: deviceId,
      encryptedPayload,
      timestamp: Date.now(),
      groupId: groupId || null
    };

    // Try to deliver immediately
    const recipientSocketId = connectionMap.get(recipientDeviceId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('message', message);
    } else {
      // Queue for later delivery
      if (!messageQueue.has(recipientDeviceId)) {
        messageQueue.set(recipientDeviceId, []);
      }
      messageQueue.get(recipientDeviceId).push(message);
    }

    // Send acknowledgment
    socket.emit('message-sent', { messageId, timestamp: message.timestamp });
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    const { recipientDeviceId, conversationId, isTyping } = data;
    const recipientSocketId = connectionMap.get(recipientDeviceId);

    if (recipientSocketId) {
      io.to(recipientSocketId).emit('typing-indicator', {
        senderDeviceId: deviceId,
        conversationId,
        isTyping
      });
    }
  });

  // Handle delivery receipts
  socket.on('message-delivered', (data) => {
    const { messageId, senderDeviceId } = data;
    const senderSocketId = connectionMap.get(senderDeviceId);

    if (senderSocketId) {
      io.to(senderSocketId).emit('delivery-receipt', {
        messageId,
        deviceId,
        status: 'delivered',
        timestamp: Date.now()
      });
    }
  });

  // Handle read receipts
  socket.on('message-read', (data) => {
    const { messageId, senderDeviceId } = data;
    const senderSocketId = connectionMap.get(senderDeviceId);

    if (senderSocketId) {
      io.to(senderSocketId).emit('read-receipt', {
        messageId,
        deviceId,
        status: 'read',
        timestamp: Date.now()
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Device disconnected: ${deviceId}`);
    connectionMap.delete(deviceId);
    deviceSessions.set(deviceId, {
      identityKey,
      lastSeen: Date.now()
    });
  });
});

// REST API Endpoints

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: Date.now(),
    connections: connectionMap.size,
    queuedMessages: Array.from(messageQueue.values()).reduce((sum, msgs) => sum + msgs.length, 0)
  });
});

// Request magic link
app.post('/api/auth/request-magic-link', async (req, res) => {
  try {
    const { email, deviceId, identityKey } = req.body;

    if (!email || !deviceId || !identityKey) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate magic link token
    const token = uuidv4();
    const expires = Date.now() + parseInt(process.env.MAGIC_LINK_EXPIRY || 900000); // 15 minutes

    pendingMagicLinks.set(token, {
      email,
      deviceId,
      identityKey,
      expires
    });

    // Send email
    const magicLink = `${FRONTEND_URL}/auth/verify?token=${token}`;

    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'noreply@b2g-vault.com',
        to: email,
        subject: 'Your VAULT Login Link',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🔒 VAULT</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Secure Messaging</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Login Request</h2>
              <p>Click the button below to securely log into your VAULT account:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${magicLink}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: 600;">
                  Login to VAULT
                </a>
              </div>
              
              <p style="font-size: 14px; color: #666;">
                This link will expire in 15 minutes.<br>
                If you didn't request this, please ignore this email.
              </p>
              
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
              
              <p style="font-size: 12px; color: #999; text-align: center;">
                VAULT - Where Messages Go to Never Be Found<br>
                Military-Grade End-to-End Encryption
              </p>
            </div>
          </body>
          </html>
        `
      });

      res.json({
        success: true,
        message: 'Magic link sent to your email',
        expiresIn: 900 // seconds
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
      res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Magic link error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify magic link
app.post('/api/auth/verify-magic-link', (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token required' });
    }

    const linkData = pendingMagicLinks.get(token);

    if (!linkData) {
      return res.status(404).json({ error: 'Invalid or expired token' });
    }

    if (Date.now() > linkData.expires) {
      pendingMagicLinks.delete(token);
      return res.status(410).json({ error: 'Token expired' });
    }

    // Generate JWT
    const authToken = jwt.sign(
      {
        deviceId: linkData.deviceId,
        identityKey: linkData.identityKey,
        email: linkData.email
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Clean up magic link
    pendingMagicLinks.delete(token);

    res.json({
      success: true,
      token: authToken,
      deviceId: linkData.deviceId,
      email: linkData.email
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get device info (for multi-device)
app.get('/api/devices/:identityKey', (req, res) => {
  const { identityKey } = req.params;

  const devices = Array.from(deviceSessions.entries())
    .filter(([_, session]) => session.identityKey === identityKey)
    .map(([deviceId, session]) => ({
      deviceId,
      lastSeen: session.lastSeen,
      isOnline: connectionMap.has(deviceId)
    }));

  res.json({ devices });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Start server
httpServer.listen(PORT, () => {
  console.log(`🔒 VAULT Relay Server running on port ${PORT}`);
  console.log(`📧 Email service: ${process.env.EMAIL_SERVICE || 'resend'}`);
  console.log(`🌐 Frontend URL: ${FRONTEND_URL}`);
  console.log(`⏰ Max message TTL: ${MAX_MESSAGE_TTL / 1000}s`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
