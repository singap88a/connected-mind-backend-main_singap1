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

router.get("/status", async (req, res) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({
        error: true,
        message: "غير مصرح",
        isAuthenticated: false
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decoded.id).select("-password");
      
      if (!user) {
        return res.status(404).json({
          error: true,
          message: "المستخدم غير موجود",
          isAuthenticated: false
        });
      }

      if (user.block) {
        return res.status(403).json({
          error: true,
          message: "تم حظر حسابك",
          isAuthenticated: false
        });
      }

      return res.status(200).json({
        error: false,
        message: "تم التحقق من حالة المستخدم بنجاح",
        isAuthenticated: true,
        user: user
      });
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError);
      return res.status(401).json({
        error: true,
        message: "رمز غير صالح",
        isAuthenticated: false
      });
    }
  } catch (error) {
    console.error("Error in auth status check:", error);
    return res.status(500).json({
      error: true,
      message: "خطأ في التحقق من حالة المستخدم",
      isAuthenticated: false
    });
  }
});

module.exports = router;
