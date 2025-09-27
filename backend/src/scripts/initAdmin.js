import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { config } from "dotenv";

config();

const initAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log("Admin user already exists:", existingAdmin.email);
      return;
    }

    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || "admin@codeshare.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123456";
    const adminName = process.env.ADMIN_NAME || "Admin User";

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const adminUser = new User({
      fullName: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      status: 'active'
    });

    await adminUser.save();

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", adminEmail);
    console.log("🔑 Password:", adminPassword);
    console.log("⚠️  Please change the default password after first login");

    // Create a test moderator as well
    const moderatorEmail = process.env.MODERATOR_EMAIL || "moderator@codeshare.com";
    const moderatorPassword = process.env.MODERATOR_PASSWORD || "mod123456";
    const moderatorName = process.env.MODERATOR_NAME || "Moderator User";

    const modSalt = await bcrypt.genSalt(10);
    const modHashedPassword = await bcrypt.hash(moderatorPassword, modSalt);

    const moderatorUser = new User({
      fullName: moderatorName,
      email: moderatorEmail,
      password: modHashedPassword,
      role: 'moderator',
      status: 'active'
    });

    await moderatorUser.save();

    console.log("✅ Moderator user created successfully!");
    console.log("📧 Moderator Email:", moderatorEmail);
    console.log("🔑 Moderator Password:", moderatorPassword);

  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  }
};

// Run the script
initAdmin();