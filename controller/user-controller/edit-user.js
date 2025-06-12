const userModel = require("../../models/User");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

async function editUserController(req, res) {
  try {
    const { id } = req.params.id || request.query || req.body;
    const { username, email, password, phone, block, hideContent, role } =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid user ID",
      });
    }

    const updateData = { username, email, block, hideContent, role };

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 12);
        updateData.password = hashedPassword;
      }

    const user = await userModel.findByIdAndUpdate(
      id,
        updateData,
      { new: true, runValidators: true }
    );

    await user.save();

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: 200,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      status: 500,
      message: "Server error",
    });
  }
}

module.exports = editUserController;
