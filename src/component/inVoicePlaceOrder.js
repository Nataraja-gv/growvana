const React = require("react");
const {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} = require("@react-pdf/renderer");

// Growvana logo URL
const logoUrl =
  "https://freshcartdev.s3.eu-north-1.amazonaws.com/growvana_logo.png";

// Styles
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: "Helvetica" },
  logo: { width: 100, height: 40, marginBottom: 10 },
  section: { marginBottom: 15 },
  heading: { fontSize: 20, marginBottom: 10, textAlign: "center" },
  subheading: { fontSize: 14, marginBottom: 5, fontWeight: "bold" },
  label: { fontWeight: "bold" },
  text: { marginBottom: 2 },
  hr: { borderBottomWidth: 1, borderBottomColor: "#ccc", marginVertical: 8 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  item: { marginBottom: 4 },
  page2: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
    backgroundColor: "green",
  },
});

const OrderInvoiceDocument = ({ totalAmount, lastestOrder }) => {
  const address = lastestOrder.address || {};
  const items = lastestOrder.items || [];

  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { style: styles.page },

      // Logo
      React.createElement(Image, { style: styles.logo, src: logoUrl }),

      // Title
      React.createElement(Text, { style: styles.heading }, "Order Invoice"),

      // Order Details
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          Text,
          { style: styles.subheading },
          "Order Details"
        ),
        React.createElement(
          Text,
          { style: styles.text },
          `Order ID: ${lastestOrder._id}`
        ),
        React.createElement(
          Text,
          { style: styles.text },
          `Date: ${new Date(lastestOrder.createdAt).toLocaleDateString()}`
        ),
        React.createElement(
          Text,
          { style: styles.text },
          `Status: ${lastestOrder.orderStatus}`
        )
      ),

      // Shipping Address
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          Text,
          { style: styles.subheading },
          "Shipping Address"
        ),
        React.createElement(
          Text,
          { style: styles.text },
          `${address.firstName}`
        ),
        React.createElement(
          Text,
          { style: styles.text },
          `${address.streetAddress}`
        ),
        React.createElement(
          Text,
          { style: styles.text },
          `${address.city}, ${address.state} - ${address.pinCode}`
        ),
        React.createElement(
          Text,
          { style: styles.text },
          `Phone: ${address.phoneNumber}`
        )
      ),

      // Items
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          Text,
          { style: styles.subheading },
          "Items Ordered"
        ),
        ...items.map((item, index) =>
          React.createElement(
            View,
            { key: index, style: styles.item },
            React.createElement(
              Text,
              null,
              `${item.product.product_name} *  ${item.quantity} = ${item.product.offer_price} Rs`
            )
          )
        )
      ),

      // Payment Info
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          Text,
          { style: styles.subheading },
          "Payment Details"
        ),
        React.createElement(
          Text,
          { style: styles.text },
          `Payment Method: ${lastestOrder.paymentMethod}`
        ),
        React.createElement(
          Text,
          { style: styles.text },
          `Payment Status: ${lastestOrder.paymentStatus}`
        ),
        React.createElement(
          Text,
          { style: styles.text },
          `Total Amount: Rs.${totalAmount}`
        )
      ),

      // Notes
      React.createElement(
        View,
        null,
        React.createElement(Text, { style: styles.subheading }, "Note:"),
        React.createElement(
          Text,
          { style: styles.text },
          "This is a system-generated invoice and does not require a signature."
        )
      )
    )
  );
};

module.exports = OrderInvoiceDocument;
