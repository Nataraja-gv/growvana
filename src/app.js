const express = require("express");
require("dotenv").config();

const ConnectDB = require("./config/database");
const categoryRouter = require("./routers/categoryRouter");
const adminRouter = require("./routers/adminRouter");
const cookieParser = require("cookie-parser");
const authRouter = require("./routers/authRouter");
const productRouter = require("./routers/productRouter");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/", categoryRouter);
app.use("/", adminRouter);
app.use("/", authRouter);
app.use("/", productRouter);

const startServer = async () => {
  try {
    await ConnectDB();
    console.log("✅ Database connected successfully");

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error.message);
    process.exit(1);
  }
};
startServer();
