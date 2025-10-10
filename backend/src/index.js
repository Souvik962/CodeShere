import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

// Import socket AFTER dotenv
console.log("Importing socket.js...");
const { app, server } = await import("./lib/socket.js");
console.log("Socket imported successfully");

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

console.log("Loading auth routes...");
const authRoutes = (await import("./routes/auth.route.js")).default;
app.use("/api/auth", authRoutes);
app.use("/api/user", authRoutes);
console.log("Auth routes loaded");

console.log("Loading post routes...");
const postRoutes = (await import("./routes/sendPost.route.js")).default;
app.use("/api/posts", postRoutes);
console.log("Post routes loaded");

console.log("Loading notification routes...");
const notificationRoutes = (await import("./routes/notification.route.js")).default;
app.use("/api/notifications", notificationRoutes);
console.log("Notification routes loaded");

console.log("Loading admin routes...");
const adminRoutes = (await import("./routes/admin.route.js")).default;
app.use("/api/admin", adminRoutes);
console.log("Admin routes loaded");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  connectDB();
});