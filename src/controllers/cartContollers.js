const Product = require("../models/productModel");
const User = require("../models/userModel");

const updateCart = async (req, res) => {
  try {
    const { cartItems } = req.body;
    const userId = req.user._id;
    const missingColorType = cartItems.some((item) => !item.colorType);
    if (missingColorType) {
      return res
        .status(400)
        .json({ message: "Each cart item must have a colorType" });
    }

    const cartItemIds = cartItems.map((item) => item.productId);

    const existProduct = await Product.find({ _id: { $in: cartItemIds } });

    if (cartItemIds.length !== existProduct.length) {
      return res.status(400).json({ message: "Some products do not exist" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItemMap = new Map();
    user.cartItems.forEach((item) => {
      cartItemMap.set(item.productId.toString(), item);
    });

    for (const newItem of cartItems) {
      const productIdStr = newItem.productId.toString();
      if (cartItemMap.has(productIdStr)) {
        cartItemMap.get(productIdStr).quantity += newItem.quantity;
      } else {
        user.cartItems.push({
          productId: newItem.productId,
          quantity: newItem.quantity,
          colorType: newItem.colorType,
        });
      }
    }

    await user.save();

    res.status(200).json({ message: "Cart updated successfully", data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    const cartItems = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { cartItems: { productId: productId } } },
      { new: true }
    );
    res.status(200).json({
      message: "Product removed from cart successfully",
      data: cartItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCartItems = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById({ _id: userId }).populate(
      "cartItems.productId"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Cart items retrieved successfully",
      data: user.cartItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { $set: { cartItems: [] } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Cart cleared successfully",
      data: user.cartItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCartItemQuantity = async (req, res) => {
  try {
    const { productId, action, colorType } = req.body;
    const userId = req.user._id;

    if (!colorType) {
      res.status(400).json({ message: "color type required" });
    }

    const user = await User.findById({ _id: userId }).populate("cartItems");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItem = user.cartItems.find(
      (item) => item.productId.toString() === productId
    );
    if (!cartItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }
    const validAction = ["increment", "decrement"];

    if (!validAction.includes(action)) {
      res.status(400).json({ message: `${action} type invalid` });
    }

    if (action === "increment") {
      cartItem.quantity += 1;
    } else if (action === "decrement") {
      cartItem.quantity -= 1;
      if (cartItem.quantity < 1) {
        user.cartItems = user.cartItems.filter(
          (item) => item.productId.toString() !== productId
        );
      }
    }
    cartItem.colorType = colorType;
    await user.save();

    res.status(200).json({
      message: `Cart item ${action}ed successfully`,
      data: user.cartItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  updateCart,
  updateCartItemQuantity,
  removeFromCart,
  getCartItems,
  clearCart,
};
