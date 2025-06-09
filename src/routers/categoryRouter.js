const express = require("express");
const { addCategory, updateCategory, allCategory } = require("../controllers/categoryControlles");
const upload = require("../middleware/mullter");
const AdminAuth = require("../middleware/adminAuth");

const categoryRouter = express.Router();

categoryRouter.post(
  "/adminauth/category/add",
  AdminAuth,
  upload.single("category_image"),
  addCategory
);

categoryRouter.patch(`/adminauth/category/edit/:_id`,AdminAuth, upload.single("category_image"),updateCategory);
categoryRouter.get("/category/all",allCategory)
 

module.exports = categoryRouter;
