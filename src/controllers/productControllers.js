const { Category } = require("../models/categoryModel");
const Product = require("../models/productModel");

const ProductAddControllers = async (req, res) => {
  try {
    const {
      product_name,
      rating,
      currect_price,
      offer_price,
      description,
      category,
      color_options,
    } = req.body;
    const validFields = [
      "product_name",
      "rating",
      "currect_price",
      "offer_price",
      "description",
      "category",
      "inStock",
      "color_options",
    ];

    const validColor = ["orange", "black", "white", "green"];

    const invalidFields = Object.keys(req.body).filter(
      (field) => !validFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res
        .status(400)
        .json({ message: `Invalid field(s): ${invalidFields.join(", ")}` });
    }

    if (req.files.length === 0) {
      return res.status(400).json({ message: "Product image is required" });
    }
    if (
      !product_name ||
      !rating ||
      !currect_price ||
      !offer_price ||
      !description ||
      !category ||
      !color_options
    ) {
      return res.status(400).json({ message: "all  fields are required" });
    }

    const existProduct = await Product.findOne({ product_name });
    if (existProduct) {
      return res.status(400).json({
        message: `${existProduct?.product_name} product already exists`,
      });
    }

    const existCategory = await Category.findById({ _id: category });

    if (!existCategory) {
      return res.status(400).json({ message: "Category not found" });
    }

    if (Number(currect_price) <= Number(offer_price)) {
      return res
        .status(400)
        .json({ message: "Offer price less than Product Price" });
    }

    // if (!validColor.includes(color_options)) {
    //   return res.status(400).json({ message: "color options in valid" });
    // }

    // const colorOptions = color_options.map((color) => color.toLowerCase());

    // const allColorsValid = colorOptions.every((color) =>
    //   validColor.includes(color)
    // );

    // if (!allColorsValid) {
    //   return res.status(400).json({ message: "color options invalid" });
    // }

    const images = req.files.map((item) => ({
      image_link: item.location,
    }));

    const data = {
      product_name,
      rating,
      currect_price,
      offer_price,
      description,
      category,
      color_options,
      product_images: images,
    };

    const productResponse = await Product(data);
    const response = await productResponse.save();
    res.status(200).json({
      message: `${product_name} product is saved sucessfully`,
      data: response,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 15;

    limit = limit > 15 ? 15 : limit;
    skip = (page - 1) * limit;

    const allProducts = await Product.find()
      .populate("category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);
    res?.status(200)?.json({
      message: "all product Data",
      data: allProducts,
      totalProducts,
      totalPages,
      currentPage: page,
      recordPerPage: limit,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const ProductData = await Product.findById({ _id: productId }).populate(
      "category"
    );
    if (!ProductData) {
      return res.status(404).json({ message: "Product not found" });
    }

    res?.status(200)?.json({
      message: "Product Data",
      data: ProductData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editProductControllers = async (req, res) => {
  try {
    const productId = req.params.productId;

    const {
      product_name,
      rating,
      currect_price,
      offer_price,
      description,
      category,
      color_options,
      inStock,
      product_images,
    } = req.body;

    const validFields = [
      "product_name",
      "rating",
      "currect_price",
      "offer_price",
      "description",
      "category",
      "inStock",
      "color_options",
      "inStock",
      "product_images",
    ];

    const validColor = ["orange", "black", "white", "green"];

    const invalidFields = Object.keys(req.body).filter(
      (field) => !validFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res
        .status(400)
        .json({ message: `Invalid field(s): ${invalidFields.join(", ")}` });
    }

    if (
      !product_name ||
      !rating ||
      !currect_price ||
      !offer_price ||
      !description ||
      !category ||
      !color_options ||
      !inStock
    ) {
      return res.status(400).json({ message: "all  fields are required" });
    }

    let updateImages = [];

    if (product_images) {
      let existingImages = [];
      if (typeof product_images === "string") {
        existingImages = [product_images];
      } else if (Array.isArray(product_images)) {
        existingImages = product_images;
      }

      updateImages = existingImages?.map((item) => ({
        image_link: item,
      }));
    }

    if (req.files && req.files.length > 0) {
      newImages = req.files.map((item) => ({
        image_link: item.location,
      }));
      updateImages = [...updateImages, ...newImages];
    }

    const existProduct = await Product.findById({ _id: productId });
    if (!existProduct) {
      return res.status(400).json({ message: "Product not found" });
    }

    const existCategory = await Category.findById({ _id: category });

    if (!existCategory) {
      return res.status(400).json({ message: "Category not found" });
    }

    if (Number(currect_price) <= Number(offer_price)) {
      return res
        .status(400)
        .json({ message: "Offer price less than Product Price" });
    }

    // const colorOptions = color_options?.map((color) => color.toLowerCase());

    // const allColorsValid = colorOptions.every((color) =>
    //   validColor.includes(color)
    // );

    // if (!allColorsValid) {
    //   return res.status(400).json({ message: "color options invalid" });
    // }

    let inStockCode = false;
    if (typeof inStock === "string") {
      if (inStock.toLowerCase() === "true") {
        inStockCode = true;
      } else if (inStock.toLowerCase() === "false") {
        inStockCode = false;
      } else {
        return res.inStock(400).json({
          message: "Invalid inStock value. Must be 'true' or 'false'.",
        });
      }
    } else if (typeof inStock === "boolean") {
      inStockCode = inStock;
    } else if (inStock !== undefined) {
      return res?.status(400).json({ message: "Invalid inStock value." });
    }

    const data = {
      product_name,
      rating,
      currect_price,
      offer_price,
      description,
      category,
      color_options,
      product_images: updateImages,
      inStock: inStockCode,
    };

    const productResponse = await Product.findByIdAndUpdate(
      { _id: productId },
      data,
      { new: true }
    );
    const response = await productResponse.save();
    res.status(200).json({
      message: `${product_name} updated  sucessfully`,
      data: response,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProductControllers = async (req, res) => {
  try {
    const ProductId = req.params.productId;

    const existProduct = await Product.findById({ _id: ProductId });
    if (!existProduct) {
      return res.status(400).json({ message: "Product not found" });
    }

    const deleteproduct = await Product.findByIdAndDelete({ _id: ProductId });
    res.status(200).json({ message: "product delete successfuly" });
  } catch (error) {
    res.inStock(500).json({ message: error.message });
  }
};

const categoryByProduct = async (req, res) => {
  try {
    const { categoryId } = req.query;

    const ProductList = await Product.find({ category: categoryId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ message: "category by product", data: ProductList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const filterProduct = async (req, res) => {
  try {
    const {filter} = req.query;
    const filterData = await Product.find({
      product_name: { $regex: filter, $options: "i" },
    });
    res.status(200).json({ message: "search products", data: filterData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  ProductAddControllers,
  getAllProducts,
  editProductControllers,
  deleteProductControllers,
  getProductById,
  categoryByProduct,
  filterProduct,
};
