const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    required: true,
  },
  pdf: {
    type: String,
  },
});

module.exports= mongoose.model("Course", courseSchema);