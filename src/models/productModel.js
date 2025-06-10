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
      type: [String],
      required: true,
      validate:{
        validator: function(value) {
          const validColors =["orange", "black", "white", "green"];
          return value.every(color => validColors.includes(color));
        },
        message: "Invalid color option"
      },
      default: ["white"],
    },
  },
  { timestamps: true }
);

 
const Product = mongoose.model("products", productSchema);

module.exports = Product;
