const mongoose = require("mongoose");

const SubScriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    planType: {
      type: String,
      enum: ["monthlyPlan", "yearPlan", "quarterlyPlan"],
      required: true,
      validate: {
        validator: function (value) {
          return ["monthlyPlan", "yearPlan", "quarterlyPlan"].includes(value);
        },
        message: (props) => `${props.value} is not a valid subscription plan.`,
      },
    },
    planDetails: {
      PlanAmount: { type: Number, required: true },
      durationInDays: { type: Number, required: true },
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    razorpayDetails: {
      orderId: { type: String }, // razorpay_order_id
      paymentId: { type: String }, // razorpay_payment_id
      signature: { type: String }, // razorpay_signature
    },
    notes: {
      userName: { type: String },
      email: { type: String },
    },
    active: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const SubScription = mongoose.model("userSubscription", SubScriptionSchema);

module.exports = SubScription;
