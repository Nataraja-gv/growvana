const { Category } = require("../models/categoryModel");

const addCategory = async (req, res) => {
  try {
    const { category_name, status } = req.body;
    const category_image = req.file;

    if (!category_name) {
      return res.status(400).json({ message: "Category name is required." });
    }

    if (!category_image) {
      return res.status(400).json({ message: "Category image is required." });
    }

    const existingCategory = await Category.findOne({ category_name });
    if (existingCategory) {
      return res.status(409).json({ message: "Category already exists." });
    }

    let statusCode = true;
    if (typeof status === "string") {
      if (status.toLowerCase() === "true") {
        statusCode = true;
      } else if (status.toLowerCase() === "false") {
        statusCode = false;
      } else {
        return res.status(400).json({
          message: "Invalid status value. Must be 'true' or 'false'.",
        });
      }
    } else if (typeof status === "boolean") {
      statusCode = status;
    } else if (status !== undefined) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const newCategory = new Category({
      category_name,
      category_image: category_image.location,
      status: statusCode,
    });

    const savedCategory = await newCategory.save();

    return res.status(201).json({
      message: "Category added successfully.",
      data: savedCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const _id = req.params._id;
    const { category_name, status, category_image } = req.body;

    if (!_id) {
      return res.status(404).json({ message: "category id required" });
    }

    const existCategory = await Category.findById(_id);
    if (!existCategory) {
      return res.status(404).json({ message: "category not found" });
    }

    if ((!category_name, !status)) {
      return res
        .status(404)
        .json({ message: "category name and status required" });
    }

    let categoryImage;
    if (req.file) {
      categoryImage = req.file.location;
    } else {
      categoryImage = category_image;
    }

    let statusCode = false;
    if (typeof status === "string") {
      if (status.toLowerCase() === "true") {
        statusCode = true;
      } else if (status.toLowerCase() === "false") {
        statusCode = false;
      } else {
        return res.status(400).json({
          message: "Invalid status value. Must be 'true' or 'false'.",
        });
      }
    } else if (typeof status === "boolean") {
      statusCode = status;
    } else if (status !== undefined) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const data = {
      category_name,
      status: statusCode,
      category_image: categoryImage,
    };
    const categoryData = await Category.findByIdAndUpdate({ _id }, data, {
      new: true,
    });
    const response = await categoryData.save();
    res.status(200).json({
      message: `${category_name} updated succesfully`,
      data: response,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const allCategory = async (req, res) => {
  try {
    let limit = parseInt(req.query.limit || 15);
    let page = parseInt(req.query.page || 1);

    limit = limit > 15 ? 15 : limit;
    skip = (page - 1) * limit;

    const categoryData = await Category.find()
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    const total_records = await Category.find();
    const totalPages = Math.ceil(total_records.length / limit);
    res.status(200).json({
      message: `all category DEtails`,
      currectPage: page,
      recordPerPage: limit,
      totalRecords: total_records.length,
      totalPages,
      data: categoryData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addCategory, updateCategory, allCategory };
