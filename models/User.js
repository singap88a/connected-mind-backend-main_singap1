const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "username is required"],
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [20, "Username cannot exceed 20 characters"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (email) {
          return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email);
        },
        message: "Please enter a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    block: {
      type: Boolean,
      default: false,
    },
    hideContent: {
      type: Boolean,
      default: false,
    },
    role:{
      type:String,
      default:'user',
      enum:['user','admin']
    }
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
