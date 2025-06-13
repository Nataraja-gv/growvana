const express = require("express");
const userAuth = require("../middleware/userauth");
const {
  newAddressControllers,
  getUsersAddress,
} = require("../controllers/addressControllers");

const addressRouter = express.Router();

addressRouter.post("/user/address/new", userAuth, newAddressControllers);
addressRouter.get("/user/address/all", userAuth, getUsersAddress);

module.exports = addressRouter;
