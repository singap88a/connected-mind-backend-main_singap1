const UserModel = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid email format" });
    }

    const user = await UserModel.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    if (user.block) {
        return res
          .status(403)
          .json({ message: "Your account is blocked. Access denied." });
      }

    const tokenPayload = {
      id: user._id,
      email: user.email,
      phone: user.phone,
      block: user.block,
      hideContent: user.hideContent,
      role: user.role,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });

    res.cookie("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        block: user.block,
        hideContent: user.hideContent,
        role: user.role,
      },
      message: "Login successful",
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      message: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

module.exports = loginController;
