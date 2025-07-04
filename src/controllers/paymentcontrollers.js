const AddressModel = require("../models/addressModel");
const orderModel = require("../models/orderSchema");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const RazorPayInstance = require("../utils/razorPayInstance");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const { sendOrderMail } = require("./sendOrderEmail");
const { SubScription_PLAN_CONFIG } = require("../utils/subscription");
const SubScription = require("../models/subscriptionmodel");
const sendSubsciptionEmail = require("./sendSubscription");

const RazorPayOrderController = async (req, res) => {
  try {
    const { address, items, paymentMethod } = req.body;
    const userId = req.user._id;
    const user = req.user;

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

    const userValid = await User.findById({ _id: userId });
    const deliveryFee = userValid?.isPremium ? 0 : 25;
    const delivary_free_amount = deliveryFee * 100;
    const options = {
      amount: totalAmount * 100 + delivary_free_amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userName: user?.name,
        email: user?.email,
      },
    };

    const razorPayResponse = await RazorPayInstance.orders.create(options);
    const order = new orderModel({
      userId,
      address: selectedAddress,
      items: items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      })),
      totalAmount: razorPayResponse.amount / 100,
      paymentMethod,
      razorpayDetails: {
        orderId: razorPayResponse.id,
      },
      delivary_free: {
        delivary_amount: deliveryFee,
      },
      notes: razorPayResponse.notes,
    });
    const data = await order.save();
    await order.save();
    const clearOrders = await User.findById({ _id: userId });

    clearOrders.cartItems = [];
    await clearOrders.save();

    res.status(200).json({ message: "paymwnt data", data: razorPayResponse });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const RazorPayVerify = async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");
    const validWebhookSignature = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.Razorpay_webhookSecret
    );
    if (!validWebhookSignature) {
      return res.status(400).json({ message: "invalid webhook signature" });
    }

    const paymentDetails = req.body.payload.payment.entity;

    const order = await orderModel.findOne({
      "razorpayDetails.orderId": paymentDetails?.order_id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.paymentStatus =
      paymentDetails?.status === "captured" ? "Paid" : "Failed";
    order.razorpayDetails.paymentId = paymentDetails.id;
    order.razorpayDetails.signature = webhookSignature;

    await order.save();
     await sendOrderMail(order.notes.email, order.totalAmount, order.items?.length,order);


    res.status(200).json({ message: "webhook received successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const RazorPayPremiumController = async (req, res) => {
  try {
    const { planType } = req.query;
    const userId = req.user._id;
    const user = req.user;
    if (!planType) {
      return res.status(400).json({ message: " plan type required" });
    }
    const validPlantype = ["monthlyPlan", "yearPlan", "quarterlyPlan"];

    if (!validPlantype.includes(planType)) {
      return res
        .status(400)
        .json({ message: `${planType} is an invalid plan type.` });
    }

    const existingPlan = await SubScription.findOne({
      user: userId,
      active: true,
      endDate: { $gt: new Date() },
    });

    if (existingPlan) {
      return res
        .status(400)
        .json({ message: "User already has an active subscription." });
    }

    const config = SubScription_PLAN_CONFIG[planType];
    if (!config) {
      return res.status(400).json({ message: "Plan configuration not found." });
    }

    const totalAmount = config?.PlanAmount;
    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userName: user?.name,
        email: user?.email,
      },
    };

    const razorPayResponse = await RazorPayInstance.orders.create(options);
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + config.durationInDays);

    const newSubScription = new SubScription({
      user: userId,
      planType,
      planDetails: {
        PlanAmount: razorPayResponse.amount / 100,
        durationInDays: config.durationInDays,
      },
      startDate,
      endDate,
      razorpayDetails: {
        orderId: razorPayResponse.id,
      },
      notes: razorPayResponse.notes,
      active: false,
    });

    await newSubScription.save();

    res.status(200).json({ message: "payment data", data: razorPayResponse });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const RazorPayPremiumVerify = async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");
    const validWebhookSignature = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.Razorpay_webhookSecret
    );

    if (!validWebhookSignature) {
      return res.status(400).json({ message: "invalid webhook signature" });
    }

    const paymentDetails = req.body.payload.payment.entity;

    const order = await SubScription.findOne({
      "razorpayDetails.orderId": paymentDetails?.order_id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.active = paymentDetails?.status === "captured" ? true : false;
    order.razorpayDetails.paymentId = paymentDetails.id;
    order.razorpayDetails.signature = webhookSignature;
    order.status = paymentDetails?.status === "captured" ? "Paid" : "Failed";

    await order.save();
    const user = await User.findOne({ email: paymentDetails.notes.email });
    user.isPremium = paymentDetails?.status === "captured" ? true : false;
    await user.save();
    //  console.log(order?.notes.email,"order?.notes.email")
    //  console.log(order,"order")
    await sendSubsciptionEmail(order?.notes.email, order);

    res.status(200).json({ message: "webhook received successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports = {
  RazorPayOrderController,
  RazorPayVerify,
  RazorPayPremiumController,
  RazorPayPremiumVerify,
};
