const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    product_images: {
      type: Array,
      required: true,
    },
    product_name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    currect_price: {
      type: Number,
      required: true,
    },
    offer_price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      ref: "categorys",
      required: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    color_options: {
      type: String,
      enum: {
        values: ["orange", "black", "white", "green"],
        message: "{VALUE} is not supported",
      },
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("products", productSchema);

module.exports = Product;
