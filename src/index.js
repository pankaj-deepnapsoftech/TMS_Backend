import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import http from 'http';

// ----------------- local imports -------------------
import { config } from './config/env.config.js';
import { Server } from 'socket.io';

// -------------------- routes imports -------------------
import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import TodoRoutes from './routes/Todo.routes.js';
import { authMiddleware } from './middleware/authMiddleware.js';

// ----------------- server port -------------------
const PORT = 8093;

// -------------  db connection here ---------------
connectDB();

const app = express();

// ----------------- Express app setup middlewares -------------------
app.use(express.json());
app.use(
  cors({
    origin:
      config.NODE_ENV !== 'development'
        ? config.CLIENT_URL
        : config.CLIENT_URL_LOCAL,
    methods: ['POST', 'PUT', 'PATCH', 'DELETE', 'GET', 'OPTIONS'],
    credentials: true,
  })
);
// ------------------- Health route -------------------
app.get('/health', (_req, res) => {
  res.send('Server is healthy and Ok');
});

// ------------------ all routes here -------------------
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/todos', authMiddleware, TodoRoutes);

// -------------------------- http server for socket connection --------------------------
// Create an HTTP server and pass the Express app to it

const server = http.createServer(app);

// -------------------------- Socket.io setup --------------------------
// Create a new instance of Socket.io and pass the HTTP server to it
// Configure CORS for Socket.io

const io = new Server(server, {
  cors: {
    origin:
      config.NODE_ENV !== 'development'
        ? config.CLIENT_URL
        : config.CLIENT_URL_LOCAL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  },
});

// -------------------------- Socket.io event listeners --------------------------
io.on('connection', (socket) => {
  console.log('A user Socket connected id is : %s', socket.id);
});

// ------------------------------ Handle disconnection ------------------------------
io.on('disconnect', (reason) => {
  console.log('A user Socket disconneted', reason);
});

// -------------------------- Start the server --------------------------
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export { io };
