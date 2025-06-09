const JWT = require("jsonwebtoken");
const User = require("../models/userModel");
const signupValidation = require("../utils/signupValidation");

const AdminSignUpControllers = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    signupValidation(req);
    const existUser = await User.findOne({ email });

    if (existUser) {
      throw new Error("Admin all Ready exist");
    }

    const data = {
      name,
      email,
      password,
    };

    const user = new User(data);
    const response = await user.save();
    const token = await response.getJWt();
    res.cookie("admintoken", token);
    res.status(200).json({ message: "admin register successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const AdminLoginAuth = async (req, res) => {
  try {
    const emailId = "admin@gmail.com";
    const pwd = "Admin123@";
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(500).json({ message: "Email and Password Required" });
    }

    if (email !== emailId) {
      return res.status(500).json({ message: "Email invalid" });
    }

    if (password !== pwd) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = await User.findOne({ email });

    const token = await user.getJWt();
    res.cookie("admintoken", token);
    res.status(200).json({ message: "admin logged successfully" ,data:user});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminLogout = async (req, res) => {
  try {
    res.cookie("admintoken", null, { expires: new Date(Date.now()) });

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const adminProfile = async (req, res) => {
  try {
    const admin = req.admin;
    res.status(200).json({ message: "admin profile details", data: admin });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  AdminLoginAuth,
  adminLogout,
  AdminSignUpControllers,
  adminProfile,
};
