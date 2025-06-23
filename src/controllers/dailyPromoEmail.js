const nodemailer = require("nodemailer");
const User = require("../models/userModel");
const cron = require("node-cron");

const sendDailyPromo = async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "natarajagv369@gmail.com",
        pass: "rgdy anma umhf mjxg",
      },
    });

    const users = await User.find({ email: { $ne: null } });

    if (!users || users.length === 0) {
      console.log("No users found to send promo email.");
      return;
    }

    for (const user of users) {
      const mailOptions = {
        from: '"Growvana 🌿" <natarajagv369@gmail.com>',
        to: user.email,
        subject: "🌞 Start Your Day with Green Energy!",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #2ecc71;">Good Morning from Growvana 🌿</h2>
            <p>Hi ${
              user.name || ""
            }, brighten up your home and your mood with beautiful indoor plants.</p>
            <p>🌼 <strong>Shop now</strong> and make your life naturally beautiful!</p>
            <a href="https://devwebs.info/" style="background: #2ecc71; padding: 10px 20px; color: white; text-decoration: none; border-radius: 5px;">🛒 Visit Growvana</a>
            <br /><br />
            <p style="font-size: 12px; color: #aaa;">You're receiving this email because you subscribed to Growvana updates.</p>
          </div>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Promo email sent to: ${user.email}`);
      } catch (err) {
        console.error(`Failed to send to ${user.email}:`, err.message);
      }
    }
  } catch (error) {
    console.error("Error in sending daily promo:", error.message);
  }
};

cron.schedule("0 6 * * *", () => {
  sendDailyPromo();
});

module.exports = { sendDailyPromo };
