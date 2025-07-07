const express = require("express");
const { dashBoardDetails } = require("../controllers/overAllDashboard");

const DashboardRouter = express.Router();

DashboardRouter.get("/dashboard/overAll/details",dashBoardDetails);

module.exports = DashboardRouter;
