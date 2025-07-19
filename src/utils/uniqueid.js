const crypto = require("crypto");

const generateCryptoInvoiceId = () => {
  //   const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `growvana-monthly-invoice-${randomPart}`;
};

module.exports = { generateCryptoInvoiceId };
