const AddressModel = require("../models/addressModel");
const orderModel = require("../models/orderSchema");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const { sendOrderMail, sendOrderStatusEmail } = require("./sendOrderEmail");

const placeTheOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const userEmail = req.user.email;
    const { address, items, paymentMethod } = req.body;

    const existAddress = await AddressModel.find({ userId });

    const allAddresses = existAddress.flatMap((doc) => doc.addresses);

    const isAddressValid = allAddresses.some(
      (item) => item._id.toString() === address
    );

    const selectedAddress = allAddresses.find(
      (item) => item._id.toString() === address
    );

    if (!isAddressValid) {
      return res.status(400).json({ message: "Invalid address" });
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    // Step 1: Combine quantities for the same product
    const quantityMap = {};

    for (const item of items) {
      const productId = item.product;
      const quantity = Number(item.quantity);

      if (quantityMap[productId]) {
        quantityMap[productId] += quantity;
      } else {
        quantityMap[productId] = quantity;
      }
    }

    // Step 2: Fetch products and calculate total
    let totalAmount = 0;

    for (const productId in quantityMap) {
      const product = await Product.findById(productId);

      if (!product) {
        return res
          .status(400)
          .json({ message: `Product with id ${productId} not found` });
      }

      totalAmount += Number(product.offer_price) * quantityMap[productId];
    }

    const validPaymentMethod = ["COD", "Online"];

    if (!validPaymentMethod.includes(paymentMethod)) {
      return res.status(400).json({ message: "invalid payment method" });
    }

    const order = new orderModel({
      userId,
      address: selectedAddress,
      items: items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      })),
      totalAmount,
      paymentMethod,
    });

    const response = await order.save();

    if (!response) {
      return res.status(500).json({ message: "Failed to place order" });
    }

    const clearOrders = await User.findById({ _id: userId });

    clearOrders.cartItems = [];
    await clearOrders.save();

    await sendOrderMail(userEmail, order.totalAmount, items);

    res.status(200).json({ message: "Order placed successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const existAllOrders = await orderModel
      .find()
      .populate("items.product")
      .populate("address.addressId")
      .populate("userId")
      .sort({ createdAt: -1 });
    res.status(200).json({ message: " all orders List", data: existAllOrders });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateDelivaryStatus = async (req, res) => {
  try {
    const { orderStatus, orderId, paymentStatus, userId } = req.body;
    const validOrderStatus = [
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Out for Delivery",
    ];

    if (!validOrderStatus.includes(orderStatus)) {
      return res
        .status(400)
        .json({ message: `invalid ${orderStatus} order status type` });
    }

    const userDetails = await User.findById({ _id: userId });
    if (!userDetails) {
      return res.status(400).json({ message: "user Details not found" });
    }
    const orderDetails = await orderModel.findById({ _id: orderId });
    if (!orderDetails) {
      return res.status(400).json({ message: "order Details not found" });
    }

    if (paymentStatus) {
      orderDetails.paymentStatus = paymentStatus;
    }

    orderDetails.orderStatus = orderStatus;
    await orderDetails.save();
    await sendOrderStatusEmail(userDetails.email, orderStatus);

    res.status(200).json({ message: "order status updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const allOrdersByUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const orderList = await orderModel
      .find({ userId: userId })
      .select(
        "address items totalAmount paymentMethod paymentStatus orderStatus createdAt"
      )
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "user order list", data: orderList });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports = {
  placeTheOrder,
  getAllOrders,
  updateDelivaryStatus,
  allOrdersByUser,
};
