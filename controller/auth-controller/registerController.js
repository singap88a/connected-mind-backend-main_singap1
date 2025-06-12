const userModel = require("../../models/User");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

const registerController = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error(errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ msg: " please fill in all fields" });
    }

    const existingUser = await userModel.findOne({
      email: email,
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
      role: "user",
      block: false,
      hideContent: false,
    });

    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;

    res.json({
      status: 201,
      message: "User created successfully",
      user: userWithoutPassword,
      success: true,
      error: false,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      error: true,
      success: false,
    });
  }
};
module.exports = registerController;
