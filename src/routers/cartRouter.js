const express = require("express");
const userAuth = require("../middleware/userauth");
const {
  updateCart,
  removeFromCart,
  getCartItems,
  clearCart,
  updateCartItemQuantity,
} = require("../controllers/cartContollers");

const cartRouter = express.Router();

cartRouter.post("/user/cart/update", userAuth, updateCart);
cartRouter.post("/user/cart/remove", userAuth, removeFromCart);
cartRouter.get("/user/cart/all", userAuth, getCartItems);
cartRouter.post("/user/cart/clear", userAuth, clearCart);
cartRouter.post("/user/cart", userAuth, updateCartItemQuantity);


module.exports = cartRouter;
