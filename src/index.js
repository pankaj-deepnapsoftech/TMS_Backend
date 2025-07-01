import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';

const PORT = 5000;
connectDB();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
