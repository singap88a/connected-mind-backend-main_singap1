const mongoose = require('mongoose');
const Course = require('../../models/Course');

async function deleteCourseController(req, res) {
  const { id } = req.params || req.query || req.body;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid course ID' });
  }

  try {
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = deleteCourseController;
