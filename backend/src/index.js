import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/sendPost.route.js";
import notificationRoutes from "./routes/notification.route.js";
import adminRoutes from "./routes/admin.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://codeshere.onrender.com",
    ],
    credentials: true,
  })
);


// Mount routes
app.use("/api/auth", authRoutes);        // For authentication (signup, login, logout, profile)
app.use("/api/user", authRoutes);        // For user actions (delete own posts, etc.)
app.use("/api/posts", postRoutes);       // For general post operations
app.use("/api/notifications", notificationRoutes); // For notifications
app.use("/api/admin", adminRoutes);      // For admin operations

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  connectDB();
});