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
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.json({ 
        authenticated: false,
        message: "لم يتم العثور على رمز المصادقة"
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      
      try {
        const user = await User.findById(decoded.id);
        
        if (!user) {
          return res.json({ 
            authenticated: false,
            message: "المستخدم غير موجود"
          });
        }

        if (user.block) {
          return res.json({ 
            authenticated: false,
            message: "تم حظر حسابك"
          });
        }

        return res.json({ 
          authenticated: true,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            block: user.block,
            hideContent: user.hideContent
          }
        });
      } catch (dbError) {
        console.error("Database error in status check:", dbError);
        return res.status(500).json({ 
          error: true,
          message: "خطأ في الاتصال بقاعدة البيانات",
          details: dbError.message
        });
      }
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError);
      return res.status(401).json({ 
        error: true,
        message: "رمز المصادقة غير صالح",
        details: jwtError.message
      });
    }
  } catch (error) {
    console.error("Unexpected error in status check:", error);
    return res.status(500).json({ 
      error: true,
      message: "حدث خطأ غير متوقع",
      details: error.message
    });
  }
});

module.exports = router;
