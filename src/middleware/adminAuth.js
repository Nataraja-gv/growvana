const JWT = require("jsonwebtoken");
const User = require("../models/userModel");

const AdminAuth = async (req, res, next) => {
  try {
    const { admintoken } = req.cookies;
    if (!admintoken) {
      return res.status(401).json({ message: "Please Login" });
    }
    const decodedEmail = await JWT.verify(
      admintoken,
      process.env.JWT_SECRET_kEY
    );
    const { _id } = decodedEmail;
    const adminUser = await User.findById(_id).select("name email");
    req.admin = adminUser;

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = AdminAuth;
