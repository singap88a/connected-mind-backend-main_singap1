const Course = require("../../models/Course");

async function createCourseController(req, res) {
    const { title, url, type, pdf, completed } = req.body;

    if (!title || !url || !type) {
        return res.status(400).json({
            message: "Title, URL, and Type are required fields."
        });
    }

    try {
        const course = new Course({
            title,
            url,
            type,
            pdf: pdf || null,
            completed
        });

        const savedCourse = await course.save();

        res.status(201).json({
            message: "Course created successfully!",
            parts: savedCourse
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || "An error occurred while creating the course."
        });
    }
}

module.exports = createCourseController;