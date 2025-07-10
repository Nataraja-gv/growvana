const express = require("express");
const { dashBoardDetails } = require("../controllers/overAllDashboard");
const AdminAuth = require("../middleware/adminAuth");

const DashboardRouter = express.Router();

DashboardRouter.get("/dashboard/overAll/details", AdminAuth, dashBoardDetails);

module.exports = DashboardRouter;
