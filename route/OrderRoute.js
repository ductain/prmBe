const express = require("express");
const { getOrderDetailsById, getOrdersByAccountId, getOrders, createOrder } = require("../controller/order");

const router = express.Router();

router.get("/", getOrders);
router.post("/", createOrder);
router.get("/account", getOrdersByAccountId);
router.get("/:orderId", getOrderDetailsById);

module.exports = router;