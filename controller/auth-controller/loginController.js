const UserModel = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: "يرجى إدخال البريد الإلكتروني وكلمة المرور"
      });
    }

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail(email)) {
      return res.status(400).json({ 
        error: true,
        message: "صيغة البريد الإلكتروني غير صحيحة" 
      });
    }

    let user;
    try {
      user = await UserModel.findOne({ email }).select("+password");
    } catch (dbError) {
      console.error("Database error while finding user:", dbError);
      return res.status(500).json({
        error: true,
        message: "خطأ في الاتصال بقاعدة البيانات",
        details: dbError.message
      });
    }

    if (!user) {
      return res.status(401).json({
        error: true,
        message: "البريد الإلكتروني غير مسجل"
      });
    }

    let isPasswordValid;
    try {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } catch (bcryptError) {
      console.error("Error comparing passwords:", bcryptError);
      return res.status(500).json({
        error: true,
        message: "خطأ في التحقق من كلمة المرور"
      });
    }

    if (!isPasswordValid) {
      return res.status(401).json({
        error: true,
        message: "كلمة المرور غير صحيحة"
      });
    }

    if (user.block) {
      return res.status(403).json({
        error: true,
        message: "تم حظر حسابك. يرجى التواصل مع الدعم الفني"
      });
    }

    const tokenPayload = {
      id: user._id,
      email: user.email,
      phone: user.phone,
      block: user.block,
      hideContent: user.hideContent,
      role: user.role,
    };

    let token;
    try {
      token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      });
    } catch (jwtError) {
      console.error("Error creating JWT:", jwtError);
      return res.status(500).json({
        error: true,
        message: "خطأ في إنشاء جلسة المستخدم"
      });
    }

    res.cookie("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      error: false,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        block: user.block,
        hideContent: user.hideContent,
        role: user.role,
      },
      message: "تم تسجيل الدخول بنجاح"
    });
  } catch (err) {
    console.error("Unexpected error in login controller:", err);
    return res.status(500).json({
      error: true,
      message: "حدث خطأ غير متوقع",
      details: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};

module.exports = loginController;
