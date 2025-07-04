const nodemailer = require("nodemailer");
const React = require("react");
const { renderToBuffer } = require("@react-pdf/renderer");
const SubsriptionInVoice = require("../component/subsciptioninvoice");

const sendSubsciptionEmail = async (toEmail, subsciptionData) => {
  try {
    const pdfBuffer = await renderToBuffer(
      React.createElement(SubsriptionInVoice, { subsciptionData })
    );
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "natarajagv369@gmail.com",
        pass: "rgdy anma umhf mjxg",
      },
    });

    const mailOptions = {
      from: '"Growvana" <noReplay@gmail.com>',
      to: toEmail,
      subject: "Your Growvana  Subsciption Confirmation",
      html: `
     <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <h2 style="color: #2a7ae2;">Growvana Subscription Confirmation</h2>

    <p>Hi ${subsciptionData.notes.userName},</p>

    <p>Thank you for subscribing to Growvana! Here are your subscription details:</p>

    <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Plan Type</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${
          subsciptionData.planType
        }</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Amount</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">₹${
          subsciptionData.planDetails.PlanAmount
        }</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Duration</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${
          subsciptionData.planDetails.durationInDays
        } days</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Start Date</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${new Date(
          subsciptionData.startDate
        ).toLocaleDateString()}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>End Date</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${new Date(
          subsciptionData.endDate
        ).toLocaleDateString()}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Status</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${
          subsciptionData.status
        }</td>
      </tr>
    </table>

    <p>A PDF invoice is attached to this email for your records.</p>

    <p>If you have any questions, feel free to reach out to us.</p>

    <p>Thank you,<br/>The Growvana Team</p>
  </div>
`,

      attachments: [
        {
          filename: "subscription_invoice.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = sendSubsciptionEmail;
