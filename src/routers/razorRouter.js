const express = require("express");
const userAuth = require("../middleware/userauth");
const {
  RazorPayOrderController,
  RazorPayVerify,
} = require("../controllers/razorpayControllers");
const razorPayRouter = express.Router();

razorPayRouter.post(
  "/user/order/razorpay/create",
  userAuth,
  RazorPayOrderController
);
razorPayRouter.post("/payment/webhook", RazorPayVerify);

module.exports = razorPayRouter;
