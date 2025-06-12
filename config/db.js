const mongoose = require("mongoose");

const connectDB = async (url) => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 10,
      retryWrites: true,
      retryReads: true,
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

  } catch (error) {
    console.error("MongoDB connection error:", error);
    setTimeout(() => connectDB(url), 5000);
  }
};

module.exports = connectDB;
