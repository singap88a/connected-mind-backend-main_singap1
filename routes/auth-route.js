const express = require("express");
const registerController = require("../controller/auth-controller/registerController");
const loginController = require("../controller/auth-controller/loginController");
const logoutController = require("../controller/auth-controller/logoutController");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);

router.get("/status", async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]  ;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decoded.id);
      return res.json({ authenticated: true, user });
    }
    res.json({ authenticated: false });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
