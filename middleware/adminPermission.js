const adminPermission = (req, res, next) => {
    if (req.user.role === "admin") {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  };
  
  
  module.exports = adminPermission;