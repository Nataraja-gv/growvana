const express = require("express");
const { AdminLoginAuth, adminLogout } = require("../controllers/adminAuthControllers");

const adminRouter = express.Router();

adminRouter.post("/admin/auth/login",AdminLoginAuth)
adminRouter.post('/adminauth/logout',adminLogout)

module.exports=adminRouter