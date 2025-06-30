const express = require("express");
require("dotenv").config();
require("./controllers/dailyPromoEmail");
const deactivateExpiredSubscriptions = require("./utils/deactivateExpiredSubscriptions");
deactivateExpiredSubscriptions();
const cors = require("cors");

const ConnectDB = require("./config/database");
const categoryRouter = require("./routers/categoryRouter");
const adminRouter = require("./routers/adminRouter");
const cookieParser = require("cookie-parser");
const authRouter = require("./routers/authRouter");
const productRouter = require("./routers/productRouter");
const profileRouter = require("./routers/profileRouter");
const cartRouter = require("./routers/cartRouter");
const addressRouter = require("./routers/addressRouter");
const orderRouter = require("./routers/orderRouter");
const razorPayRouter = require("./routers/razorRouter");
const SubscriptionRouter = require("./routers/subScriptionRouter");
 
 

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use("/", categoryRouter);
app.use("/", adminRouter);
app.use("/", authRouter);
app.use("/", productRouter);
app.use("/", profileRouter);
app.use("/", cartRouter);
app.use("/", addressRouter);
app.use("/", orderRouter);
app.use("/", razorPayRouter);
app.use("/", SubscriptionRouter);

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
