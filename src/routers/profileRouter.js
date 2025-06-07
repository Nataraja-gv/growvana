const express = require("express");
const userAuth = require("../middleware/userauth");
const userProfile = require("../controllers/profileControllers");

const profileRouter= express.Router();

profileRouter.get("/user/auth/profile",userAuth,userProfile)



module.exports=profileRouter