const express = require("express");
const userAuth = require("../middleware/userauth");
const { RazorPayController, RazorPayVerify } = require("../controllers/razorpayControllers");

const razorPayrouter = express.Router();

razorPayrouter.post(
  "/user/order/razorpay/create",
  userAuth,
  RazorPayController
);
razorPayrouter.post("/payment/webhook",RazorPayVerify)

module.exports = razorPayrouter;
