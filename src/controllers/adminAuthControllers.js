const JWT = require("jsonwebtoken");

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

    const token = await JWT.sign(
      { email: emailId },
      process.env.JWT_SECRET_kEY,
      { expiresIn: "1d" }
    );
    res.cookie("admintoken", token);
    res.status(200).json({ message: "admin logged successfully" });
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

module.exports = { AdminLoginAuth, adminLogout };
