const express = require("express");
const { getProducts } = require("../controller/product");

const router = express.Router();

router.get("/", getProducts);

module.exports = router;