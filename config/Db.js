
const mongoose = require("mongoose");
require("dotenv").config();
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    });
    console.log("✅ Kết Nối Server Thành Công");
  } catch (error) {
    console.error("❌ Lỗi kết nối MongoDB:", error.message);
  }
}

module.exports = connectDB;