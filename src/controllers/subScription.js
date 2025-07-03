const SubScription = require("../models/subscriptionmodel");
const User = require("../models/userModel");
const { SubScription_PLAN_CONFIG } = require("../utils/subscription");
const cron = require("node-cron");
const sendSubsciptionEmail = require("./sendSubscription");

const createSubscription = async (req, res) => {
  try {
    const userId = req.user._id;
    const { planType } = req.query;

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

    const plan_config = SubScription_PLAN_CONFIG[planType];
    if (!plan_config) {
      return res.status(400).json({ message: "Plan configuration not found." });
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan_config.durationInDays);

    const newSubScription = new SubScription({
      user: userId,
      planType,
      planDetails: {
        PlanAmount: plan_config.PlanAmount,
        durationInDays: plan_config.durationInDays,
      },
      startDate,
      endDate,
      active: true,
    });

    await newSubScription.save();

    const user = await User.findById({ _id: userId });

    user.isPremium = newSubScription.planType ? true : false;
    await user.save(user?.notes.email, newSubScription);
    await sendSubsciptionEmail();
    res.status(201).json({
      message: "Subscription created successfully.",
      subscription: newSubScription,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserSubscription = async (req, res) => {
  try {
    const userId = req.user._id;
    const userSubScription = await SubScription.findOne({
      user: userId,
      active: true,
      endDate: { $gt: new Date() },
    });

    if (!userSubScription) {
      return res.status(400).json({ message: "user subscription not found" });
    }
    res.status(201).json({
      message: "Subscription Details fetch successfully.",
      subscription: userSubScription,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSubscription, getUserSubscription };
