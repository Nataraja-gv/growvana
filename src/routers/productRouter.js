const express = require("express");

const {
  ProductAddControllers,
  getAllProducts,
  editProductControllers,
  deleteProductControllers,
  getProductById,
  categoryByProduct,
  filterProduct,
} = require("../controllers/productControllers");
const AdminAuth = require("../middleware/adminAuth");
const upload = require("../middleware/mullter");

const productRouter = express.Router();

productRouter.post(
  "/adminauth/product/add",
  AdminAuth,
  upload.array("product_images"),
  ProductAddControllers
);

productRouter.patch(
  "/adminauth/product/edit/:productId",
  AdminAuth,
  upload.array("product_images"),
  editProductControllers
);

productRouter.get("/allproducts/all", getAllProducts);
productRouter.get("/product/:productId", getProductById);
productRouter.get("/product/category/all", categoryByProduct);
productRouter.get("/products/filter", filterProduct);

productRouter.delete(
  "/adminauth/product/delete/:productId",
  AdminAuth,
  deleteProductControllers
);

module.exports = productRouter;
