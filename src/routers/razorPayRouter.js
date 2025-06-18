const express = require("express");
const userAuth = require("../middleware/userauth");
const { RazorPayOrderController, RazorPayVerify } = require("../controllers/razorpayControllers");
 
 

const razorPayrouter = express.Router();

razorPayrouter.post(
  "/user/order/razorpay/create",
  userAuth,
  RazorPayOrderController
);
razorPayrouter.post("/payment/webhook",RazorPayVerify)

module.exports = razorPayrouter;
