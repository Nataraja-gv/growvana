const express = require("express");
const userAuth = require("../middleware/userauth");
const AdminAuth = require("../middleware/adminAuth");
const {
  RazorPayOrderController,
  RazorPayVerify,
} = require("../controllers/paymentcontrollers.js");
const AllRegisteredUsers = require("../controllers/allusers.js");
const razorPayRouter = express.Router();

razorPayRouter.post(
  "/user/order/razorpay/create",
  userAuth,
  RazorPayOrderController
);
razorPayRouter.post("/orders/payment/webhook", RazorPayVerify);
razorPayRouter.get("/user/registered/users", AdminAuth, AllRegisteredUsers);

module.exports = razorPayRouter;
