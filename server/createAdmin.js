const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

const MONGO_URI = process.env.MONGO_URI;

const createAdmin = async () => {
  try {
    if (!MONGO_URI) {
      console.error("❌ MONGO_URI is missing from .env");
      process.exit(1);
    }

    await mongoose.connect(MONGO_URI);

    console.log("✅ MongoDB Connected");

    const adminEmail = "admin@rental.com";
    const adminPassword = "admin123";

    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists");

      await mongoose.connection.close();
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await User.create({
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    console.log("=================================");
    console.log("✅ ADMIN CREATED SUCCESSFULLY");
    console.log("=================================");
    console.log("Name:", admin.name);
    console.log("Email:", admin.email);
    console.log("Password:", adminPassword);
    console.log("Role:", admin.role);
    console.log("=================================");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:");
    console.error(error);

    await mongoose.connection.close().catch(() => {});

    process.exit(1);
  }
};

createAdmin();