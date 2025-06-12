const courseModel = require("../../models/Course");

async function getCourseDetails(req, res) {
  try {
    const courseId = req.params.id || req.query.courseId || req.body.courseId;
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "course not found" });
    }
    res.status(200).json({
        message: "course details retrieved successfully",
        data: course,
    })
  } catch (error) {
    console.error;
    res.status(500).json({ message: error.message });
  }
}

module.exports = getCourseDetails;
