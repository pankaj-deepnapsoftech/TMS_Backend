import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import http from "http";

import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { config } from './config/env.config.js';
import { Server } from 'socket.io';

const PORT = 8093;
connectDB();
const app = express();
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
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);

const server = http.createServer(app);

const io = new Server(server,{
  cors:{
    origin: config.NODE_ENV !== 'development' ? config.CLIENT_URL : config.CLIENT_URL_LOCAL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }
})

io.on('connection', (socket) => {
  console.log('A user Socket connected id is : %s', socket.id);
});


io.on('disconnect', (reason) => {
  console.log('A user Socket disconneted', reason);
});


server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

export { io }