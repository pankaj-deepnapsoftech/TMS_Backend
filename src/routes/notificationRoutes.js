import express from 'express';
import {
  getNotifications,
  markAsRead,
} from '../controller/NotificationController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getNotifications);
router.put('/:id/read', authMiddleware, markAsRead);

export default router;
