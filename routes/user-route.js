const express = require('express');

const authToken = require('../middleware/authToken');
const adminPermission = require('../middleware/adminPermission');

const getAllUsers = require('../controller/user-controller/get-all-users');
const getUserDetails = require('../controller/user-controller/user-details-controller');
const editUserController = require('../controller/user-controller/edit-user');
const deleteUserController = require('../controller/user-controller/delete-user');
const getBlockedUsers = require('../controller/blackList-controller/show-all-blackList');

const router = express.Router();

router.get('/', authToken,getAllUsers);
router.get("/user-details", authToken, getUserDetails);
router.patch("/edit-user/:id", authToken, editUserController);
router.delete("/delete-user/:id", authToken, deleteUserController);


router.get('/blackList',authToken,getBlockedUsers);


module.exports = router;