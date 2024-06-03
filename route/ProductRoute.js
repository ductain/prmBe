const express = require("express");
const { getProducts, getProductById } = require("../controller/product");

const router = express.Router();

router.get("/", getProducts);
router.get("/detail", getProductById);

module.exports = router;