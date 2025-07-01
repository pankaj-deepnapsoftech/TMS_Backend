// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import { config } from '../config/env.config.js';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  let token = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, config.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
};
