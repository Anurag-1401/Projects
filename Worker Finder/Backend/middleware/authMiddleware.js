const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); 
const Admin = require("../models/adminModel"); 

const authMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token received:", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let user = await User.findById(decoded.id).select("-password");
      if (!user) {
        user = await Admin.findById(decoded.id).select("-password -categories");
      }

      if (!user) {
        return res.status(401).json({ message: "User not found, not authorized" });
      }

      req.user = { id: user._id, role: user.role, categories: user.categories || [] };
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied, admin only" });
  }
  next();
};

module.exports = { authMiddleware, adminOnly };
