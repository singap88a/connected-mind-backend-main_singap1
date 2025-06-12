const express = require('express');
const authToken = require('../middleware/authToken');
const adminPermission = require('../middleware/adminPermission');
const createCourseController = require('../controller/course-controller/create-course-controller');
const getAllCourses = require('../controller/course-controller/get-courses-controller');
const deleteCourseController = require('../controller/course-controller/delete-course-controller');
const getCourseDetails = require('../controller/course-controller/get-course-details-controller');
const editCourseController = require('../controller/course-controller/edit-course-controller');
const router = express.Router();


router.post('/create-course',authToken,adminPermission,createCourseController);
router.get('/get-courses',authToken,getAllCourses);
router.get('/course-details/:id',authToken,getCourseDetails);
router.patch('/edit-course/:id',authToken,adminPermission,editCourseController)
router.delete('/delete-course/:id',authToken,adminPermission,deleteCourseController)

module.exports = router;