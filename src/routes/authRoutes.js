import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getAllEmployees,
} from '../controller/AuthController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, getUserProfile);
router.get('/employees', getAllEmployees);
router.put('/:id', authMiddleware, updateUserProfile);
router.delete('/:id', authMiddleware, deleteUserProfile);

export default router;
