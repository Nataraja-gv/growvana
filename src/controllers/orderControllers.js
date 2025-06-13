const AddressModel = require("../models/addressModel");
const orderModel = require("../models/orderSchema");
const Product = require("../models/productModel");

const placeTheOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { address, items, paymentMethod } = req.body;

    if (address & !address) {
      return res.status(400).json({ message: "addres is required" });
    }
    const existAddress = await AddressModel.find({ userId });
     const isAddressValid = existAddress.addresses.some((item)=>item._id.toString()===address)

     if (!isAddressValid) {
      return res.status(400).json({ message: "Invalid address" });
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById({ _id: item?.product });
      if (!product) {
        return res
          .status(400)
          .json({ message: `product with id ${item?.product} not found` });
      }
      totalAmount += product.offer_price * product.quantity;
    }

    const validPaymentMethod = ["COD", "Online"];

    if (!validPaymentMethod.includes(paymentMethod)) {
      return res.status(400).json({ message: "invalid payment method" });
    }

    const order = new orderModel({
      userId,
      address,
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

    res.status(200).json({ message: "Order placed successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { placeTheOrder };
