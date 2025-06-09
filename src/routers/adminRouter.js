const express = require("express");
const {
  AdminLoginAuth,
  adminLogout,
  AdminSignUpControllers,
  adminProfile,
} = require("../controllers/adminAuthControllers");
const AdminAuth = require("../middleware/adminAuth");

const adminRouter = express.Router();

adminRouter.post("/admin/auth/login", AdminLoginAuth);
adminRouter.post("/adminauth/logout", adminLogout);
adminRouter.post("/adminauth/signup", AdminSignUpControllers);
adminRouter.get("/adminauth/profile",AdminAuth ,adminProfile);


module.exports = adminRouter;
