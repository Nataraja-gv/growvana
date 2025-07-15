const React = require("react");
const {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} = require("@react-pdf/renderer");

const logoUrl =
  "https://freshcartdev.s3.eu-north-1.amazonaws.com/growvana_logo.png";

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
  tableHeader: { flexDirection: "row", backgroundColor: "#f5f5f5", padding: 5 },
  tableRow: { flexDirection: "row", padding: 5 },
  col1: { width: "50%" },
  col2: { width: "20%", textAlign: "right" },
  col3: { width: "30%", textAlign: "right" },
  totalRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10 },
  footer: { marginTop: 20, textAlign: "center", fontSize: 10 },
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const OrderMonthlyInvoiceDocument = ({ invoiceData }) => {
  if (!invoiceData || !invoiceData.length) {
    return React.createElement(
      Document,
      null,
      React.createElement(
        Page,
        { style: styles.page },
        React.createElement(
          Text,
          { style: styles.heading },
          "No Invoices Found"
        )
      )
    );
  }
  return React.createElement(
    Document,
    null,
    invoiceData.map((invoice, index) =>
      React.createElement(
        Page,
        { style: styles.page, key: invoice._id },
        // Header with Logo
        React.createElement(
          View,
          { style: styles.section },
          React.createElement(Image, { style: styles.logo, src: logoUrl }),
          React.createElement(
            Text,
            { style: styles.heading },
            "Monthly Order Invoice"
          )
        ),
        // Title
        React.createElement(
          View,
          { style: styles.section },
          React.createElement(
            Text,
            { style: styles.subheading },
            `ID: ${invoice.userId._id}`
          ),
          React.createElement(
            Text,
            { style: styles.subheading },
            `Name: ${invoice.userId.name}`
          ),
          React.createElement(
            Text,
            { style: styles.subheading },
            `Email: ${invoice.userId.email}`
          )
        ),

        // Order Details
        React.createElement(
          View,
          { style: styles.section },
          React.createElement(
            Text,
            { style: styles.subheading },
            "Order Details"
          ),
          React.createElement(View, { style: styles.hr }),
          React.createElement(
            Text,
            { style: styles.text },
            `Order ID: ${invoice._id}`
          ),
          React.createElement(
            Text,
            { style: styles.text },
            `Date: ${formatDate(invoice.createdAt)}`
          ),
          React.createElement(
            Text,
            { style: styles.text },
            `Status: ${invoice.orderStatus}`
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
          React.createElement(View, { style: styles.hr }),
          React.createElement(
            Text,
            { style: styles.text },
            invoice.address.firstName
          ),
          React.createElement(
            Text,
            { style: styles.text },
            invoice.address.streetAddress
          ),
          React.createElement(
            Text,
            { style: styles.text },
            `${invoice.address.city}, ${invoice.address.state} - ${invoice.address.pinCode}`
          ),
          React.createElement(
            Text,
            { style: styles.text },
            `Phone: ${invoice.address.phoneNumber}`
          )
        ),

        // Items Ordered
        React.createElement(
          View,
          { style: styles.section },
          React.createElement(
            Text,
            { style: styles.subheading },
            "Items Ordered"
          ),
          React.createElement(View, { style: styles.hr }),
          // Table Header
          React.createElement(
            View,
            { style: styles.tableHeader },
            React.createElement(Text, { style: styles.col1 }, "Product"),
            React.createElement(Text, { style: styles.col2 }, "Qty"),
            React.createElement(Text, { style: styles.col3 }, "Price")
          ),
          // Table Rows
          invoice.items.map((item) =>
            React.createElement(
              View,
              { style: styles.tableRow, key: item._id },
              React.createElement(
                Text,
                { style: styles.col1 },
                item.product.product_name
              ),
              React.createElement(Text, { style: styles.col2 }, item.quantity),
              React.createElement(
                Text,
                { style: styles.col3 },
                `${item.product.offer_price} Rs`
              )
            )
          ),
          // Total
          React.createElement(
            View,
            { style: styles.totalRow },
            React.createElement(
              Text,
              { style: [styles.col3, { fontWeight: "bold" }] },
              `Total: ${invoice.totalAmount} Rs`
            )
          )
        ),

        // Payment Details
        React.createElement(
          View,
          { style: styles.section },
          React.createElement(
            Text,
            { style: styles.subheading },
            "Payment Details"
          ),
          React.createElement(View, { style: styles.hr }),
          React.createElement(
            Text,
            { style: styles.text },
            `Method: ${invoice.paymentMethod}`
          ),
          React.createElement(
            Text,
            { style: styles.text },
            `Status: ${invoice.paymentStatus}`
          )
        ),

        // Footer Note
        React.createElement(
          View,
          { style: styles.footer },
          React.createElement(
            Text,
            null,
            "This is a system-generated invoice and does not require a signature."
          )
        )
      )
    )
  );
};

module.exports = OrderMonthlyInvoiceDocument;
