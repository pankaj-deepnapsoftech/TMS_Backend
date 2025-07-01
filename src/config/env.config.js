/* eslint-disable no-undef */
import dotenv from 'dotenv';

dotenv.config();

class Config {
  NODE_ENV;
  MONGODB_URI;
  JWT_SECRET;
  CLIENT_URL;
  LOCAL_CLIENT_URL;
  BACKEND_URL;
  LOCAL_BACKEND_URL;
  LOCAL_IMAGE_URL;
  IMAGE_URL;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV;
    this.MONGODB_URI = process.env.MONGODB_URI;
    this.JWT_SECRET = process.env.JWT_SECRET;
    this.CLIENT_URL = process.env.CLIENT_URL;
    this.LOCAL_CLIENT_URL = process.env.LOCAL_CLIENT_URL;
    this.BACKEND_URL = process.env.BACKEND_URL;
    this.LOCAL_BACKEND_URL = process.env.LOCAL_BACKEND_URL;
    this.LOCAL_IMAGE_URL = process.env.LOCAL_IMAGE_URL;
    this.IMAGE_URL = process.env.IMAGE_URL;
  }
}

export const config = new Config();
