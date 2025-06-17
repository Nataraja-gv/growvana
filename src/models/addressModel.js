const mongoose = require("mongoose");

const addressInfoSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  streetAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  pinCode: {
    type: String,
    required: true,
  },
});

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    addresses: [addressInfoSchema],
  },
  { timestamps: true }
);

const AddressModel = mongoose.model("userAddress", addressSchema);

module.exports = AddressModel;
