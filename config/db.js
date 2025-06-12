const mongoose = require("mongoose");

const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error("MongoDB connection error:", e);
    process.exit(1);
  }
};

module.exports = connectDB;
