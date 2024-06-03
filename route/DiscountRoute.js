const express = require("express");
const { getDiscounts, getDiscountById } = require("../controller/discount");

const router = express.Router();

router.get("/", getDiscounts);
router.get("/:discountId", getDiscountById);

module.exports = router;