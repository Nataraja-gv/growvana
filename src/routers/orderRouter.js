const express = require("express");
const userAuth = require("../middleware/userauth");
const adminAuth = require("../middleware/adminAuth");
const {
  placeTheOrder,
  getAllOrders,
  updateDelivaryStatus,
  allOrdersByUser,
} = require("../controllers/orderControllers");

const orderRouter = express.Router();

orderRouter.post("/user/order/places", userAuth, placeTheOrder);
orderRouter.get("/user/order/list", userAuth, allOrdersByUser);

orderRouter.get("/user/order/all", adminAuth, getAllOrders);
orderRouter.patch("/user/order/status/update", adminAuth, updateDelivaryStatus);

module.exports = orderRouter;
