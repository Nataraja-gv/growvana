const express = require("express");
const userAuth = require("../middleware/userauth");
const adminAuth = require("../middleware/adminAuth");
const {
  placeTheOrder,
  getAllOrders,
} = require("../controllers/orderControllers");

const orderRouter = express.Router();

orderRouter.post("/user/order/places", userAuth, placeTheOrder);
orderRouter.get("/user/order/all", adminAuth, getAllOrders);

module.exports = orderRouter;
