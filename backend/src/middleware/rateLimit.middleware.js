// backend/middleware/rateLimit.middleware.js
import rateLimit from 'express-rate-limit';
import { ipKeyGenerator } from 'express-rate-limit';

// Rate limiting for authentication endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    message: "Too many authentication attempts, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for successful requests (optional)
    return false;
  },
  keyGenerator: ipKeyGenerator
});

// General rate limiting for all routes
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    message: "Too many requests, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Strict rate limiting for password reset or other sensitive operations
export const strictRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 requests per hour
  message: {
    message: "Too many requests for this operation. Please try again in an hour."
  }
});