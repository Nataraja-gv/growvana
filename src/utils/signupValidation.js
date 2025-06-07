const validator = require("validator");

const signupValidation = (req) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new Error("all  field are required!!");
  }

  if (!validator.isEmail(email)) {
    throw new Error("invalid Email");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("password should Strong");
  }
};

module.exports = signupValidation;
