import mongoose from 'mongoose';
import { config } from './env.config.js';
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGODB_URI);
    console.log(
      `MongoDB Connected without any error host is : ` + conn.connection.host
    );
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
