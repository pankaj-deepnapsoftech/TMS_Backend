import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { config } from './config/env.config.js';

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
