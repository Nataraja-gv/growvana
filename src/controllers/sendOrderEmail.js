const nodemailer = require("nodemailer");
const React = require("react");
const { renderToBuffer} = require("@react-pdf/renderer");
const OrderInvoiceDocument = require("../component/inVoicePlaceOrder");

const sendOrderMail = async (toEmail, totalAmount, itemsList, lastestOrder) => {
  try {
    console.log("ghdggh")
    const pdfBuffer = await renderToBuffer(
      React.createElement(OrderInvoiceDocument, {
        totalAmount,
        lastestOrder,
      })
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
      subject: "Your Growvana Order Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <h2 style="color:rgb(46, 193, 85);">🎉 Thank you for shopping with Growvana!</h2>
          <p>We're happy to let you know that your order has been placed successfully.</p>
          <hr />
          <p><strong>Items Ordered:</strong> ${itemsList}</p>
          <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
          <hr />
          <p>You will receive another email once your order is shipped.</p>
          <br />
          <p style="font-size: 14px; color: #888;">Need help? Contact support@growvana.com</p>
        </div>
      `,
      attachments: [
        {
          filename: "orderinvoice.pdf",
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

const sendOrderStatusEmail = async (toEmail, orderStatus) => {
  try {
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "natarajagv369@gmail.com",
        pass: "rgdy anma umhf mjxg",
      },
    });

    const mailOptions = {
      from: '"Growvana" <natarajagv369@gmail.com>',
      to: toEmail,
      subject: `Your Growvana Order is now ${orderStatus}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <h2 style="color: #2ECC71;">🚚 Order Status Update</h2>
          <p>Your order status has been updated to: <strong>${orderStatus}</strong></p>
          <hr />
          ${
            orderStatus === "Shipped"
              ? "<p>We’ve packed your order and handed it to our delivery partner. It’s on its way!</p>"
              : orderStatus === "Out for Delivery"
              ? "<p>Your order is out for delivery and will reach you soon. Please keep your phone nearby.</p>"
              : orderStatus === "Delivered"
              ? "<p>Your order has been delivered. We hope you enjoy your purchase!</p>"
              : orderStatus === "Cancelled"
              ? "<p>Your order has been cancelled. Please contact us if you have any questions.</p>"
              : "<p>Your order is being processed. You’ll receive updates as it moves through each step.</p>"
          }
          <br />
          <p>Thank you for choosing Growvana! 🌿</p>
          <p style="font-size: 14px; color: #888;">Need help? Contact support@growvana.com</p>
        </div>
      `,
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { sendOrderMail, sendOrderStatusEmail };
