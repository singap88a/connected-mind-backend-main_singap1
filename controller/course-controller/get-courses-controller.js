const Course = require("../../models/Course");

async function getAllCourses(req, res) {
  try {
    const courses = await Course.find();
    const totalPdfs = await Course.countDocuments({
        pdf: { $exists: true, $ne: null },
      });
  
      const totalUrls = await Course.countDocuments({ url: { $ne: null } });
  
    res.status(200).json({
        message: "Course retrieved successfully",
        courses: courses,
        totalPdfs: totalPdfs,
        totalUrls: totalUrls,
  
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = getAllCourses;
