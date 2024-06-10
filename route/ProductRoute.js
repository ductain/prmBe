/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - PRODUCT_ID
 *         - PRODUCTNAME
 *         - ORIGIN
 *         - PRICE
 *         - PRODUCTDETAILS
 *         - PRODUCTMATERIAL
 *         - TYPE_ID
 *         - BRAND_ID
 *         - QUANTITY
 *       properties:
 *         PRODUCT_ID:
 *           type: string
 *           description: The unique ID of the product
 *         PRODUCTNAME:
 *           type: string
 *           description: The name of the product
 *         ORIGIN:
 *           type: string
 *           description: The origin of the product
 *         PRICE:
 *           type: number
 *           format: float
 *           description: The price of the product
 *         PRODUCTDETAILS:
 *           type: string
 *           description: Details about the product
 *         PRODUCTMATERIAL:
 *           type: string
 *           description: The material used for the product
 *         TYPE_ID:
 *           type: string
 *           description: The type ID associated with the product
 *         BRAND_ID:
 *           type: integer
 *           description: The brand ID associated with the product
 *         QUANTITY:
 *           type: integer
 *           description: The available quantity of the product
 *       example:
 *         PRODUCT_ID: "SD002"
 *         PRODUCTNAME: "Mô hình Bandai Gundam SD Sun Jian Gundam Astray Tôn Kiên 05"
 *         ORIGIN: "MADE IN JAPAN"
 *         PRICE: 180000
 *         PRODUCTDETAILS: "THƯƠNG HIỆU: BANDAI – NHẬT BẢN\nPHIÊN BẢN: SD [SUPER DEFORM]\nChiều cao: 8-10cm\nPHÂN LOẠI SP: LẮP RÁP\n– Sản phẩm nhựa cao cấp với độ sắc nét cao\n– Sản xuất bởi Bandai Namco – Nhật Bản Chính hãng\n– An toàn với trẻ em\n– Phát triển trí não cho trẻ hiệu quả đi đôi với niềm vui thích bất tận\n– Rèn luyện tính kiên nhẫn cho người chơi\n– Thông tin cơ bản:\nMô hình gundam (gunpla) là một loại mô hình nhựa được gọi là Model kit, bao gồm nhiều mảnh nhựa rời được gọi là part (bộ phận), khi lắp ráp các part lại với nhau sẽ được mô hình hoàn chỉnh. Các mảnh nhựa rời này được gắn trên khung nhựa gọi là runner.\nMỗi một hộp sản phẩm Gunpla bao gồm nhiều runner và các phụ kiện liên quan, một tập sách nhỏ (manual) bên trong giới thiệu sơ lược về mẫu Gundam trong hộp và phần hướng dẫn cách lắp ráp. o Dòng gundam với các chi tiết hoàn hảo.\nCác khớp cử động linh hoạt theo ý muốn.\nNgười chơi sẽ thỏa sức sáng tạo và đam mê."
 *         PRODUCTMATERIAL: "Nhựa"
 *         TYPE_ID: "SD"
 *         BRAND_ID: 1
 *         QUANTITY: 20
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API for managing products
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Successfully retrieved products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /products/detail:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: productId
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */

const express = require("express");
const {
  getProducts,
  getProductById,
  getFiveRandomProductsDaily,
} = require("../controller/product");
const router = express.Router();

router.get("/", getProducts);
router.get("/detail", getProductById);
router.get("/random", getFiveRandomProductsDaily);

module.exports = router;
