const mongoose = require("mongoose");

const connectDB = async (url) => {
  try {
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 10,
      minPoolSize: 5,
      retryWrites: true,
      retryReads: true,
      connectTimeoutMS: 10000,
      heartbeatFrequencyMS: 10000,
    };

    await mongoose.connect(url, options);
    console.log("Connected to MongoDB successfully");

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
      setTimeout(() => connectDB(url), 5000);
    });

    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    mongoose.connection.on('connecting', () => {
      console.log('Connecting to MongoDB...');
    });

  } catch (error) {
    console.error("MongoDB connection error:", error);
    setTimeout(() => connectDB(url), 5000);
  }
};

module.exports = connectDB;
