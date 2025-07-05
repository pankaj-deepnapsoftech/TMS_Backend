import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.config.js';
import { sendResetOTP } from '../utils/sendMail.js';
import bcrypt from 'bcryptjs';

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, config.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Register
export const registerUser = async (req, res) => {
  const { name, email, password, department } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, department });

    const token = generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res
      .status(500)
      .json({ message: 'Something went wrong during registration' });
  }
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user);
  res.status(200).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      department: user.department,
      role: user.role,
    },
    token,
  });
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        role: user.role,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to fetch profile', error: error.message });
  }
};

// Get all users with role 'employee'
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('-password');
    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, role, department } = req.body;
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'user Not Found' });

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.department = department || user.department;

    const updated = await user.save();
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'user not found' });
    await user.deleteOne();
    res.json({ message: 'user deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendOTP = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user)
    return res.status(404).json({ message: 'User not found with that email' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  user.resetOTP = otp;
  user.otpExpires = expiry;
  await user.save();

  await sendResetOTP(email, otp);

  res.status(200).json({ message: 'OTP sent to your email' });
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.resetOTP !== otp || user.otpExpires < new Date()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  res.status(200).json({ message: 'OTP verified' });
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.resetOTP !== otp || user.otpExpires < new Date()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  user.password = newPassword;
  user.markModified('password'); 
  user.resetOTP = null;
  user.otpExpires = null;
  await user.save();

  res.status(200).json({ message: 'Password reset successfully' });
};
