const express = require("express");
const userAuth = require("../middleware/userauth");
const {
  createSubscription,
  getUserSubscription,
} = require("../controllers/subScription");
const {
  RazorPayPremiumController,
  RazorPayPremiumVerify,
} = require("../controllers/paymentcontrollers");

const SubscriptionRouter = express.Router();
SubscriptionRouter.post("/user/subscription", userAuth, createSubscription);
SubscriptionRouter.post(
  "/user/subscription/razorPay",
  userAuth,
  RazorPayPremiumController
);

SubscriptionRouter.get(
  "/user/subscription/valid",
  userAuth,
  getUserSubscription
);

SubscriptionRouter.post("/premium/payment/webhook", RazorPayPremiumVerify);

module.exports = SubscriptionRouter;
