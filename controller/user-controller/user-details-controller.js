const userModel = require("../../models/User");

async function getUserDetails(req, res) {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
        message: "User details retrieved successfully",
        data: user,
    })
  } catch (error) {
    console.error;
    res.status(500).json({ message: error.message });
  }
}

module.exports = getUserDetails;
