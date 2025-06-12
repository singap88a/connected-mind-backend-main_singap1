const userModel = require("../../models/User");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

const registerController = async (req, res) => {
  try {
    // التحقق من صحة البيانات
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Validation errors:", errors.array());
      return res.status(400).json({ 
        error: true,
        message: "خطأ في البيانات المدخلة",
        details: errors.array() 
      });
    }

    const { username, email, password } = req.body;

    // التحقق من وجود جميع الحقول المطلوبة
    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: true,
        message: "يرجى ملء جميع الحقول المطلوبة" 
      });
    }

    // التحقق من وجود المستخدم
    try {
      const existingUser = await userModel.findOne({ email: email });
      if (existingUser) {
        return res.status(409).json({ 
          error: true,
          message: "البريد الإلكتروني مسجل مسبقاً" 
        });
      }
    } catch (dbError) {
      console.error("Database error while checking existing user:", dbError);
      return res.status(500).json({ 
        error: true,
        message: "خطأ في الاتصال بقاعدة البيانات",
        details: dbError.message 
      });
    }

    // تشفير كلمة المرور
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (hashError) {
      console.error("Error hashing password:", hashError);
      return res.status(500).json({ 
        error: true,
        message: "خطأ في معالجة كلمة المرور" 
      });
    }

    // إنشاء المستخدم الجديد
    try {
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

      return res.status(201).json({
        status: 201,
        message: "تم إنشاء الحساب بنجاح",
        user: userWithoutPassword,
        success: true,
        error: false,
      });
    } catch (createError) {
      console.error("Error creating user:", createError);
      return res.status(500).json({
        error: true,
        message: "خطأ في إنشاء المستخدم",
        details: createError.message
      });
    }
  } catch (err) {
    console.error("Unexpected error in register controller:", err);
    return res.status(500).json({
      error: true,
      message: "حدث خطأ غير متوقع",
      details: err.message
    });
  }
};

module.exports = registerController;
