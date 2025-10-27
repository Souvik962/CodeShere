# CodeShare Setup Guide

## Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

### Required Variables
```env
# Database
MONGODB_URI=mongodb://localhost:27017/codeshare

# JWT Secret (generate a strong secret key)
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Optional Variables
```env
# CAPTCHA Configuration
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
HCAPTCHA_SECRET_KEY=your-hcaptcha-secret-key

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Installation & Setup

### Backend Setup
```bash
cd backend
npm install
# Create .env file with required variables
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Features Added/Improved

### Security Improvements
- ✅ Input validation and sanitization
- ✅ Rate limiting on all routes
- ✅ Enhanced CORS configuration
- ✅ JWT token validation with proper error handling
- ✅ Account status checking (suspended/banned users)
- ✅ Environment variable validation

### Error Handling
- ✅ Global error handler
- ✅ Error boundaries in React
- ✅ Proper error logging
- ✅ 404 route handler
- ✅ Health check endpoint

### Code Quality
- ✅ Consistent error responses
- ✅ Better database connection handling
- ✅ Input sanitization
- ✅ Proper async/await error handling
- ✅ Environment configuration management

### Frontend Improvements
- ✅ Error boundary component
- ✅ Better error handling in API calls
- ✅ Corrected base URL configuration
- ✅ Request/response interceptors
- ✅ Timeout configuration

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/social-auth` - Social authentication
- `GET /api/auth/check` - Check authentication status
- `PUT /api/auth/update-profile` - Update user profile

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts/send` - Create new post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comments` - Add comment
- `DELETE /api/posts/:postId/comments/:commentId` - Delete comment

### Users
- `GET /api/posts/users` - Get users for sidebar

## Development Notes

1. The backend runs on port 5001 by default
2. The frontend runs on port 5173 by default
3. Make sure MongoDB is running before starting the backend
4. All API routes are prefixed with `/api`
5. CORS is configured for both development and production environments
6. Rate limiting is applied to prevent abuse
7. Input validation ensures data integrity
8. Error handling provides meaningful feedback to users

## Troubleshooting

### Common Issues
1. **MongoDB Connection Error**: Ensure MongoDB is running and MONGODB_URI is correct
2. **JWT Secret Error**: Make sure JWT_SECRET is set in environment variables
3. **CORS Issues**: Check CLIENT_URL configuration
4. **Port Already in Use**: Change PORT in .env file or kill existing process

### Health Check
Visit `http://localhost:5001/api/health` to check if the backend is running properly.
