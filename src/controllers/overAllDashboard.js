const { Category } = require("../models/categoryModel");
const orderModel = require("../models/orderSchema");
const Product = require("../models/productModel");
const SubScription = require("../models/subscriptionmodel");
const User = require("../models/userModel");

const dashBoardDetails = async (req, res) => {
  try {
    //products
    const productsLength = await Product.countDocuments();
    const Products = await Product.find().populate("category");
    const activeProducts = Products.filter((prod) => prod.inStock === true);
    const inActiveProducts = Products.filter((prod) => prod.inStock === false);

    const productCountByCategory = {};
    Products.forEach((prod) => {
      const catId = prod.category._id?.toString();
      const catName = prod.category.category_name;
      if (catName) {
        productCountByCategory[catName] =
          (productCountByCategory[catName] || 0) + 1;
      }
    });

    // category
    const categorylength = await Category.countDocuments();
    const categorys = await Category.find();
    const activecCategorys = categorys.filter((prod) => prod.status === true);
    const inActiveCategorys = categorys.filter((prod) => prod.status === false);

    //users

    const totalUsers = await User.countDocuments();
    const users = await User.find();

    const userPremium = {
      premium_users: 0,
      non_premium_users: 0,
    };

    users.forEach((user) => {
      if (user?.isPremium) {
        userPremium.premium_users += 1;
      } else {
        userPremium.non_premium_users += 1;
      }
    });

    //SubScription

    const SubScription_total = await SubScription.countDocuments();
    const SubScriptionList = await SubScription.find();

    const SubScription_type = {
      monthlyPlan: 0,
      yearPlan: 0,
      quarterlyPlan: 0,
    };

    SubScriptionList.forEach((sub) => {
      if (sub.active === true) {
        switch (sub.planType) {
          case "monthlyPlan":
            SubScription_type.monthlyPlan += 1;
            break;

          case "yearPlan":
            SubScription_type.yearPlan += 1;
            break;

          case "quarterlyPlan":
            SubScription_type.quarterlyPlan += 1;
            break;
        }
      }
    });

    const SubScription_Status = {
      active: 0,
      inactive: 0,
    };

    SubScriptionList.forEach((sub) => {
      if (sub.active === true) {
        SubScription_Status.active += 1;
      } else {
        SubScription_Status.inactive += 1;
      }
    });

    //orders details

    const orderLength = await orderModel.countDocuments();

    const orders = await orderModel.find();

    const orderPlacedDetails = {
      Processing_orders: 0,
      Shipped_orders: 0,
      Delivered_orders: 0,
      Cancelled_orders: 0,
      Out_for_Delivery_orders: 0,
    };

    orders.forEach((order) => {
      if (order) {
        switch (order.orderStatus) {
          case "Processing":
            orderPlacedDetails.Processing_orders += 1;
            break;
          case "Shipped":
            orderPlacedDetails.Shipped_orders += 1;
            break;
          case "Delivered":
            orderPlacedDetails.Delivered_orders += 1;
            break;
          case "Cancelled":
            orderPlacedDetails.Cancelled_orders += 1;
            break;
          case "Out for Delivery":
            orderPlacedDetails.Out_for_Delivery_orders += 1;
            break;
        }
      }
    });

    const orderPaymentMethod = {
      COD: 0,
      Online_payment: 0,
    };

    orders.forEach((order) => {
      if (order.paymentMethod === "Online") {
        orderPaymentMethod.Online_payment += 1;
      } else {
        orderPaymentMethod.COD += 1;
      }
    });

    const orderPayment = orders.reduce(
      (acc, order) => {
        if (order.paymentStatus === "Paid") {
          if (order.paymentMethod === "COD") {
            acc.offline_amount += order.totalAmount;
          } else if (order.paymentMethod === "Online") {
            acc.online_amount += order.totalAmount;
          }
        }
        return acc;
      },
      {
        offline_amount: 0,
        online_amount: 0,
      }
    );

    res.status(200).json({
      message: "all Data Details",
      data: {
        products: {
          total_products: productsLength,
          active_products: activeProducts.length,
          inActive_products: inActiveProducts.length,
        },
        category: {
          total_category: categorylength,
          active_category: activecCategorys.length,
          inActive_category: inActiveCategorys.length,
        },
        productCountByCategory,
        users: {
          total_users: totalUsers,
          userPremium,
        },
        SubScription: SubScription_total,
        SubScription_type,
        SubScription_Status,
        orderLength,
        orderPlacedDetails,
        orderPaymentMethod,
        orderPayment,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { dashBoardDetails };
