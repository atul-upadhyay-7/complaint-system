require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const logger = require('./utils/logger');
const notificationService = require('./services/notificationService');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');
const adminRoutes = require('./routes/admin');

const app = express();
const server = http.createServer(app);

// ─── Socket.io setup ──────────────────────────────────────────────────────
const io = new Server(server, {
    cors: {
        origin: [
            process.env.FRONTEND_URL || 'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
        ],
        credentials: true,
    },
});

io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Client sends their userId so we can target notifications
    socket.on('join:user', (userId) => {
        if (userId) {
            socket.join(`user:${userId}`);
            logger.info(`Socket ${socket.id} joined room user:${userId}`);
        }
    });

    socket.on('disconnect', () => logger.info(`Socket disconnected: ${socket.id}`));
});

// Provide io to the notification service (module-level singleton)
notificationService.setIO(io);

// ─── Middleware ────────────────────────────────────────────────────────────
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:3000'
    ],
    credentials: true,
}));
// Increased limit to 10mb to handle base64 image uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logging → Winston
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// General rate limiter
app.use('/api/complaints', apiLimiter);
app.use('/api/admin', apiLimiter);

// ─── Routes ───────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'UniIssuehub API is running 🚀',
        version: '2.1.0',
        timestamp: new Date().toISOString(),
        features: ['real-time-notifications', 'image-upload', 'analytics'],
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);

// ─── Error handling ────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────
connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    logger.info(`🚀 UniIssuehub API v2.1 running on http://localhost:${PORT}`);
    logger.info(`📡 Socket.io real-time events enabled (user rooms supported)`);
    logger.info(`📸 Image upload support enabled (base64, 10MB limit)`);
});
