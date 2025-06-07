const express = require("express");
const { signUpControllers, loginControllers, userLogout } = require("../controllers/userControllers");

const authRouter = express.Router();

authRouter.post("/userauth/signup",signUpControllers)
authRouter.post("/userauth/login",loginControllers)
authRouter.post("/userauth/logout",userLogout)





module.exports=authRouter