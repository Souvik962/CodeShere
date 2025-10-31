import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import fs from "fs";

import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import { validateEnvironment, getEnvConfig } from "./lib/env.js";

import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/sendPost.route.js";
import notificationRoutes from "./routes/notification.route.js";
import adminRoutes from "./routes/admin.route.js";

dotenv.config();

// Validate environment variables
validateEnvironment();
const config = getEnvConfig();

const PORT = config.port;
const __dirname = path.resolve();

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      config.clientUrl,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
    version: "1.0.0"
  });
});

// Root route for development
if (config.nodeEnv === "development") {
  app.get("/", (req, res) => {
    res.json({
      message: "API Server Running",
      version: "1.0.0",
      endpoints: {
        health: "/api/health",
        auth: "/api/auth",
        posts: "/api/posts",
        notifications: "/api/notifications",
        admin: "/api/admin"
      }
    });
  });
}

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/user", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

// Production static file serving (must come before 404 handler)
if (config.nodeEnv === "production") {
  // Try both possible build locations
  const buildPath = path.join(__dirname, "../build");
  const distPath = path.join(__dirname, "../frontend/dist");

  // Check which build directory exists
  const buildExists = fs.existsSync(buildPath);
  const distExists = fs.existsSync(distPath);

  if (buildExists) {
    console.log("📁 Using build directory for static files");
    app.use(express.static(buildPath));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(buildPath, "index.html"));
    });
  } else if (distExists) {
    console.log("📁 Using frontend/dist directory for static files");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  } else {
    console.error("❌ No build directory found! Expected either ../build or ../frontend/dist");
    app.get("*", (req, res) => {
      res.status(404).json({
        message: "Frontend build not found. Please check build process.",
        error: "No build directory found"
      });
    });
  }
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    message,
    ...(config.nodeEnv === 'development' && { stack: err.stack })
  });
});

// 404 handler (only for development or API routes not found)
if (config.nodeEnv === "development") {
  app.use('*', (req, res) => {
    res.status(404).json({
      message: 'Route not found',
      path: req.originalUrl
    });
  });
}

const desiredPort = parseInt(PORT, 10) || 5000;

function startServer(port) {
  // Listen for listen-errors once so we can retry on EADDRINUSE
  server.once('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is in use. Trying port ${port + 1}...`);
      // small backoff before retrying
      setTimeout(() => startServer(port + 1), 500);
      return;
    }
    console.error('Server error:', err);
    process.exit(1);
  });

  server.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    connectDB();
  });
}

startServer(desiredPort);

// Graceful shutdown helpers
function shutdown(signal) {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close((err) => {
    if (err) {
      console.error('Error while closing server:', err);
      process.exit(1);
    }
    console.log('Server closed. Exiting process.');
    process.exit(0);
  });

  // Force exit if shutdown takes too long
  setTimeout(() => {
    console.warn('Forcing shutdown after timeout');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
