const express = require("express");
const {
  dashBoardDetails,
  dashboardInvoiceDetails,
  dashboardSendInvoiceDetails,
} = require("../controllers/overAllDashboard");
const AdminAuth = require("../middleware/adminAuth");

const DashboardRouter = express.Router();

DashboardRouter.get("/dashboard/overAll/details", AdminAuth, dashBoardDetails);
DashboardRouter.get("/dashboard/invoice/preview", AdminAuth, dashboardInvoiceDetails);
DashboardRouter.get(
  "/dashboard/invoice/email",
  AdminAuth,
  dashboardSendInvoiceDetails
);

module.exports = DashboardRouter;
