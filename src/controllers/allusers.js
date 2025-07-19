const User = require("../models/userModel");

const AllRegisteredUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ data: users });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = AllRegisteredUsers;
