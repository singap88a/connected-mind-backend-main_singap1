const userModel = require("../../models/User");

async function getAllUsers(req,res) {

    try{
        const users = await userModel.find();
    res.json({
        status: 200,
        message: "Users retrieved successfully",
        data: users
    });
    }catch(err){
        console.error(err);
        res.status(500).json({
            status: 500,
            message: "Server error"
        });
    }

}

module.exports = getAllUsers;