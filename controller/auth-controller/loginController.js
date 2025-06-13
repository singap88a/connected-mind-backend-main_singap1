const UserModel = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email); // تسجيل للمراقبة

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

    const user = await UserModel.findOne({ email }).select("+password");
    
    if (!user) {
      return res.status(401).json({
        error: true,
        message: "البريد الإلكتروني غير مسجل"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
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

    // التحقق من وجود JWT_SECRET_KEY
    if (!process.env.JWT_SECRET_KEY) {
      console.error("JWT_SECRET_KEY is missing in environment variables");
      return res.status(500).json({
        error: true,
        message: "خطأ في إعدادات الخادم"
      });
    }

    const tokenPayload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    // إنشاء Token مع التحقق من الخطأ
    let token;
    try {
      token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" } // جعل مدة الصلاحية أطول للتجربة
      );
      console.log("Token generated successfully"); // تأكيد إنشاء التوكن
    } catch (jwtError) {
      console.error("JWT Generation Error:", jwtError);
      return res.status(500).json({
        error: true,
        message: "خطأ في إنشاء جلسة المستخدم",
        details: process.env.NODE_ENV === "development" ? jwtError.message : undefined
      });
    }

    // إرجاع الرد بدون الكوكيز أولاً للتجربة
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      message: "تم تسجيل الدخول بنجاح"
    });

  } catch (err) {
    console.error("Login Controller Error:", err);
    return res.status(500).json({
      error: true,
      message: "حدث خطأ غير متوقع",
      details: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};

module.exports = loginController;