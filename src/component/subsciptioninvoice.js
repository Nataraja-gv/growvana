const React = require("react");
const {
  Document,
  Page,
  View,
  StyleSheet,
  Text,
  Image,
} = require("@react-pdf/renderer");

const logoUrl =
  "https://freshcartdev.s3.eu-north-1.amazonaws.com/growvana_logo.png";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },
  logo: { width: 120, height: 50, marginBottom: 20 },
  heading: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  section: { marginBottom: 15 },
  label: { fontWeight: "bold" },
  text: { marginBottom: 3 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  footer: { marginTop: 30, fontSize: 10, color: "gray", textAlign: "center" },
});

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const SubsriptionInVoice = ({ subsciptionData }) => {
  const {
    _id,
    planType,
    planDetails,
    startDate,
    endDate,
    razorpayDetails,
    notes,
    status,
    createdAt,
  } = subsciptionData;
  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { style: styles.page },

      React.createElement(Image, { style: styles.logo, src: logoUrl }),
      // Heading
      React.createElement(
        Text,
        { style: styles.heading },
        "Subscription Invoice"
      ),

      // Invoice Info
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.text }, `Invoice ID: ${_id}`),
        React.createElement(
          Text,
          { style: styles.text },
          `Date: ${formatDate(createdAt)}`
        ),
        React.createElement(Text, { style: styles.text }, `Status: ${status}`)
      ),

      // User Info
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.label }, "Billed To:"),
        React.createElement(Text, { style: styles.text }, `${notes.userName}`),
        React.createElement(Text, { style: styles.text }, `${notes.email}`)
      ),

      // Plan Details
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          Text,
          { style: styles.label },
          "Subscription Plan:"
        ),
        React.createElement(
          Text,
          { style: styles.text },
          `Plan Type: ${planType}`
        ),
        React.createElement(
          Text,
          { style: styles.text },
          `Plan Amount: Rs.${planDetails.PlanAmount}`
        ),
        React.createElement(
          Text,
          { style: styles.text },
          `Duration: ${planDetails.durationInDays} days`
        ),
        React.createElement(
          Text,
          { style: styles.text },
          `Start Date: ${formatDate(startDate)}`
        ),
        React.createElement(
          Text,
          { style: styles.text },
          `End Date: ${formatDate(endDate)}`
        )
      ),

      // Payment Info
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.label }, "Payment Info:"),
        React.createElement(
          Text,
          { style: styles.text },
          `Payment ID: ${razorpayDetails.paymentId || "N/A"}`
        ),
        React.createElement(
          Text,
          { style: styles.text },
          `Order ID: ${razorpayDetails.orderId || "N/A"}`
        )
      ),
      React.createElement(
        Text,
        { style: styles.footer },
        "This is a system-generated invoice from Growvana and does not require a signature."
      )
    )
  );
};

module.exports = SubsriptionInVoice;
