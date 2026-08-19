const express = require("express");
const orderRouter = express.Router();

const adminAuth = require("../middleware/adminAuth");
const authUser = require("../middleware/auth");
const rateLimiter = require("../middleware/redisAuth");

const {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  getOrderById,
  updateStatus,
  verifyStripe,
  verifyRazorpay,
} = require("../controllers/orderController");

// Admin routes
orderRouter.post("/list", rateLimiter(20, 60), adminAuth, allOrders);

orderRouter.post("/status", rateLimiter(20, 60), adminAuth, updateStatus);

// Payment / Order routes
orderRouter.post("/place", rateLimiter(10, 60), authUser, placeOrder);

orderRouter.post("/stripe", rateLimiter(5, 60), authUser, placeOrderStripe);

orderRouter.post("/razorpay", rateLimiter(5, 60), authUser, placeOrderRazorpay);

// User order routes
orderRouter.post("/userOrders", rateLimiter(30, 60), authUser, userOrders);

orderRouter.get(
  "/detail/:orderId",
  rateLimiter(60, 60),
  authUser,
  getOrderById,
);

// Payment verification
orderRouter.post("/verifyStripe", rateLimiter(10, 60), authUser, verifyStripe);

orderRouter.post(
  "/verifyRazorpay",
  rateLimiter(10, 60),
  authUser,
  verifyRazorpay,
);

module.exports = orderRouter;
