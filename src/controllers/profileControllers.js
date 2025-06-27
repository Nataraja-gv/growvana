const userProfile = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(501).json({ message: "user not found" });
    }

    res
      .status(200)
      .json({ message: `${user?.name} profile details`, data: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = userProfile;
