import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

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

const authRoutes = (await import("./routes/auth.route.js")).default;
app.use("/api/auth", authRoutes);
app.use("/api/user", authRoutes);

const postRoutes = (await import("./routes/sendPost.route.js")).default;
app.use("/api/posts", postRoutes);

const notificationRoutes = (await import("./routes/notification.route.js")).default;
app.use("/api/notifications", notificationRoutes);

const adminRoutes = (await import("./routes/admin.route.js")).default;
app.use("/api/admin", adminRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  connectDB();
});