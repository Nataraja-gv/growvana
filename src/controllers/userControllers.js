const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const signupValidation = require("../utils/signupValidation");


const signUpControllers = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    signupValidation(req);
    const existUser = await User.findOne({ email });

    if (existUser) {
      throw new Error("User all Ready exist");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const data = {
      name,
      email,
      password: passwordHash,
    };

    const user = new User(data);
    const response = await user.save();
    const token = await response.getJWt();
    res.cookie("usertoken", token);

    res.status(200).json({
      message: `${response.name} signup successfully`,
      data: response,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginControllers = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password required" });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "InValid Credentials" });
    }

    const verifyPassword = await existingUser.VerifyPassword(password);

    if (!verifyPassword) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = await existingUser.getJWt();
    res.cookie("usertoken", token);

    const { name, email: isEmail } = existingUser;
    res.status(200).json({
      message: `${existingUser.name} logged`,
      data: { name, isEmail },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const userLogout = async (req, res) => {
  try {
    res.cookie("usertoken", null, {
      expires: new Date(Date.now()),
    });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { signUpControllers, loginControllers, userLogout };
