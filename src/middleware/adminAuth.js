const JWT = require("jsonwebtoken");

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

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = AdminAuth;
