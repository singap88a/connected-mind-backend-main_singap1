const courseModel = require("../../models/Course");
const mongoose = require("mongoose");

async function editCourseController(req, res) {
  try {
    // Properly extract the course ID from params, query, or body
    const id = req.params.id || req.query.id || req.body.id;
    const { title, url, pdf, completed, type } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid course ID",
      });
    }

    const updateData = { title, url, pdf, completed, type };

    // Update course using the course ID
    const course = await courseModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        status: 404,
        message: "Course not found",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({
      status: 500,
      message: "Server error",
    });
  }
}

module.exports = editCourseController;
