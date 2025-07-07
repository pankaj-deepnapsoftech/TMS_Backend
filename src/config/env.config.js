/* eslint-disable no-undef */
import dotenv from 'dotenv';

dotenv.config();

class Config {
  NODE_ENV;
  MONGODB_URI;
  JWT_SECRET;
  CLIENT_URL;
  CLIENT_URL_LOCAL;
  BACKEND_URL;
  LOCAL_BACKEND_URL;
  LOCAL_IMAGE_URL;
  IMAGE_URL;
  EMAIL_USER;
  EMAIL_PASS;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV;
    this.MONGODB_URI = process.env.MONGODB_URI;
    this.JWT_SECRET = process.env.JWT_SECRET;
    this.CLIENT_URL = process.env.CLIENT_URL;
    this.CLIENT_URL_LOCAL = process.env.CLIENT_URL_LOCAL;
    this.BACKEND_URL = process.env.BACKEND_URL;
    this.LOCAL_BACKEND_URL = process.env.LOCAL_BACKEND_URL;
    this.LOCAL_IMAGE_URL = process.env.LOCAL_IMAGE_URL;
    this.IMAGE_URL = process.env.IMAGE_URL;
    this.EMAIL_USER = process.env.EMAIL_USER;
    this.EMAIL_PASS = process.env.EMAIL_PASS;
  }
}

export const config = new Config();
