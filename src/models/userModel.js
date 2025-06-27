const mongoose = require("mongoose");
const validator = require("validator");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  colorType: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("password Should strong");
        }
      },
    },
    cartItems: [cartItemSchema],
    isPremium: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.methods.VerifyPassword = async function (password) {
  const user = this;
  const verifyPassword = await bcrypt.compare(password, user.password);
  return verifyPassword;
};

userSchema.methods.getJWt = async function () {
  const user = this;
  const usertoken = await JWT.sign(
    { _id: user._id },
    process.env.JWT_SECRET_kEY,
    { expiresIn: "2d" }
  );
  return usertoken;
};

const User = mongoose.model("Users", userSchema);

module.exports = User;
