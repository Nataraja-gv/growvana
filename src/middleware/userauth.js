const JWT = require("jsonwebtoken");
const User = require("../models/userModel");
 
 

const userAuth = async (req, res, next) => {
  const { usertoken } = req.cookies;
  if (!usertoken) {
    return res.status(401).json({ message: "Please Login" });
  }
  const decodedID = await JWT.verify(usertoken , process.env.JWT_SECRET_kEY);
  const { _id } = decodedID;

  const user = await User.findById(_id).select(["name", "email"]);
  if (!user) {
    return res.status(401).json({ message: "  user not found" });
  }
  req.user = user;
  next();
};

module.exports = userAuth;
