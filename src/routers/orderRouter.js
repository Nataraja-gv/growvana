const express = require("express");
const userAuth = require("../middleware/userauth");
const adminAuth = require("../middleware/adminAuth");
const {
  placeTheOrder,
  getAllOrders,
  updateDelivaryStatus,
} = require("../controllers/orderControllers");

const orderRouter = express.Router();

orderRouter.post("/user/order/places", userAuth, placeTheOrder);
orderRouter.get("/user/order/all", adminAuth, getAllOrders);
orderRouter.patch("/user/order/status/update", adminAuth, updateDelivaryStatus);

module.exports = orderRouter;
