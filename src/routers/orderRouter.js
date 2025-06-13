const express = require("express");
const userAuth = require("../middleware/userauth");
const { placeTheOrder } = require("../controllers/orderControllers");

const orderRouter = express.Router();

orderRouter.post("/user/order/places", userAuth, placeTheOrder);

module.exports = orderRouter;
