import nodemailer from 'nodemailer';
import { config } from '../config/env.config.js';

export const sendResetOTP = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Support Team" <${config.EMAIL_USER}>`,
    to,
    subject: 'Password Reset OTP - Valid for 10 minutes',
    text: `Hello,\n\nYour OTP for password reset is: ${otp}\n\nThis OTP is valid for the next 10 minutes. If you didn't request a password reset, please ignore this email.\n\nRegards,\nSupport Team`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ OTP sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};
