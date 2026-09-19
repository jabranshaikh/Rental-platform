const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
]);

require("dotenv").config();

const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const User = require("./models/User");

const resetAdminPassword = async () => {
  try {
    await connectDB();

    const adminEmail = "admin@staynest.com";
    const newPassword = "Admin@123456";

    const admin = await User.findOne({
      email: adminEmail,
    });

    if (!admin) {
      console.log("❌ Admin account not found.");
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    admin.password = hashedPassword;
    admin.role = "admin";

    await admin.save();

    console.log("========================================");
    console.log("ADMIN PASSWORD RESET SUCCESSFULLY");
    console.log("========================================");
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${newPassword}`);
    console.log(`Role: ${admin.role}`);
    console.log("========================================");

    process.exit(0);
  } catch (error) {
    console.error(
      "❌ Reset Admin Error:",
      error
    );

    process.exit(1);
  }
};

resetAdminPassword();