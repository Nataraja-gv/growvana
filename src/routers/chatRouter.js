const express = require("express");
const userAuth = require("../middleware/userauth");
const adminAuth = require("../middleware/adminAuth");
const {
  getusersChats,
  getAdminChats,
} = require("../controllers/chatControllers");

const chatRouter = express.Router();

chatRouter.get("/user/chat", userAuth, getusersChats);
chatRouter.get("/user/admin/chat", adminAuth, getAdminChats);

module.exports = chatRouter;
