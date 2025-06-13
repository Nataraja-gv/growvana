const AddressModel = require("../models/addressModel");

const newAddressControllers = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      firstName,
      phoneNumber,
      streetAddress,
      city,
      state,
      country,
      pinCode,
    } = req.body;

    if (
      !firstName ||
      !phoneNumber ||
      !streetAddress ||
      !city ||
      !state ||
      !country ||
      !pinCode
    ) {
      return res.status(400).json({ message: "all fields are required!!!" });
    }

    const newAddress = {
      firstName,
      phoneNumber,
      streetAddress,
      city,
      state,
      country,
      pinCode,
    };

    const existingDoc = await AddressModel.findOne({ userId });

    if (existingDoc) {
      existingDoc.addresses.push(newAddress);
      await existingDoc.save();
      res.status(200).json({ message: "Address added to existing user." });
    } else {
      const data = {
        userId,
        addresses: [newAddress],
      };
      await new AddressModel(data).save();
      res.status(200).json({ message: "Address added for new user." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsersAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const userAddress = await AddressModel.findOne({ userId });
    if (!userAddress) {
      return res.status(400).json({ message: "address not found" });
    }
    res.status(200).json({ messge: "user address", data: userAddress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { newAddressControllers, getUsersAddress };
