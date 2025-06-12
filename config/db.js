const mongoose = require("mongoose");

const connectDB = async (url) =>{
  try {
   await mongoose
.connect(url)
.then(() => console.log("Connect to MongoDB"))

  }catch(e){
    console.error(e);
    process.exit(1);
  }
}

  module.exports = connectDB