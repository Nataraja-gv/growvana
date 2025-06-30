const cron = require("node-cron");
const SubScription = require("../models/subscriptionmodel");
const User = require("../models/userModel");

const deactivateExpiredSubscriptions = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      // console.log("Running cron job at:", now);
      const expired = await SubScription.find({
        endDate: { $lte: now },
        active: true,
      });

      if (expired.length === 0) return;

      const result = await SubScription.updateMany(
        { endDate: { $lte: now }, active: true },
        { $set: { active: false } }
      );
      const userIds = expired.map((sub) => sub.user);
      await User.updateMany(
        { _id: { $in: userIds } },
        { $set: { isPremium: false } }
      );
      // console.log("Mongo Update Result:", result);
    } catch (error) {
      console.error("❌ Error updating subscriptions:", error);
    }
  });
};

module.exports = deactivateExpiredSubscriptions;
