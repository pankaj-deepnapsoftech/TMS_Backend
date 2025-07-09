import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getAllEmployees,
  sendOTP,
  verifyOTP,
  resetPassword,
  getUnapprovedUsers,
  approveUser,
  rejectUser,
} from '../controller/AuthController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/unapproved', authMiddleware, getUnapprovedUsers);
router.put('/approve/:id', authMiddleware, approveUser);
router.put('/reject/:id', authMiddleware, rejectUser);
router.get('/profile', authMiddleware, getUserProfile);
router.get('/employees', getAllEmployees);
router.put('/:id', authMiddleware, updateUserProfile);
router.delete('/:id', authMiddleware, deleteUserProfile);
router.post('/forgot-password', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

export default router;
