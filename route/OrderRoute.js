/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         ORDER_ID:
 *           type: integer
 *           description: The ID of the order.
 *         ORDER_DATE:
 *           type: string
 *           format: date-time
 *           description: The date and time of the order.
 *         ACCOUNT_ID:
 *           type: integer
 *           description: The ID of the account associated with the order.
 *         TOTALMONEY:
 *           type: number
 *           format: float
 *           description: The total amount of money for the order.
 *         ORDER_NOTE:
 *           type: string
 *           description: A note or comment for the order.
 *         PAYMENTMETHOD:
 *           type: string
 *           description: The payment method used for the order.
 *       required:
 *         - ORDER_ID
 *         - ORDER_DATE
 *         - ACCOUNT_ID
 *         - TOTALMONEY
 *         - PAYMENTMETHOD
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     OrderDetails:
 *       type: object
 *       properties:
 *         ORDER_ID:
 *           type: integer
 *           description: The ID of the order.
 *         PRODUCT_ID:
 *           type: string
 *           description: The ID of the product.
 *         QUANTITY:
 *           type: integer
 *           description: The quantity of the product in the order.
 *         UNITPRICE:
 *           type: number
 *           format: float
 *           description: The unit price of the product.
 *       required:
 *         - ORDER_ID
 *         - PRODUCT_ID
 *         - QUANTITY
 *         - UNITPRICE
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API for managing orders
 */
/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Returns an array of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /order/info:
 *   get:
 *     summary: Retrieve order information by order ID
 *     tags: [Orders]
 *     description: Fetches details of an order including order date, account ID, total money, order note, and payment method.
 *     parameters:
 *       - in: query
 *         name: orderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the order to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved order information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ORDER_ID:
 *                   type: integer
 *                 ORDER_DATE:
 *                   type: string
 *                   format: date-time
 *                 ACCOUNT_ID:
 *                   type: integer
 *                 TOTALMONEY:
 *                   type: number
 *                   format: float
 *                 ORDER_NOTE:
 *                   type: string
 *                 PAYMENTMETHOD:
 *                   type: string
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /order/details:
 *   get:
 *     summary: Retrieve order details by order ID
 *     tags: [Orders]
 *     description: Fetches details of order items including product name, product image, quantity, and unit price.
 *     parameters:
 *       - in: query
 *         name: orderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the order to retrieve details for
 *     responses:
 *       200:
 *         description: Successfully retrieved order details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ORDER_ID:
 *                     type: integer
 *                   PRODUCT_ID:
 *                     type: integer
 *                   PRODUCTNAME:
 *                     type: string
 *                   PRODUCTIMAGE:
 *                     type: string
 *                   QUANTITY:
 *                     type: integer
 *                   UNITPRICE:
 *                     type: number
 *                     format: float
 *       404:
 *         description: Order details not found
 *       500:
 *         description: Internal server error
 */



/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get orders by account ID
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: accountId
 *         required: true
 *         description: ID of the account
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Returns an array of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       404:
 *         description: Orders not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewOrder'
 *           examples:
 *             example-1:
 *               summary: A sample order
 *               value:
 *                 cart: '[{"productId": "SD001", "quantity": 2, "unitPrice": 200.0}, {"productId": "HG002", "quantity": 1, "unitPrice": 150.0}]'
 *                 accountId: 123
 *                 total: 350.0
 *                 orderNote: "Ghi gì dô đây cũng được"
 *                 paymentMethod: "Thanh toán trực tiếp"
 *     responses:
 *       200:
 *         description: Order created successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       400:
 *         description: Missing fields in the request
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       500:
 *         description: Internal server error
 */
const express = require("express");
const { getOrderDetailsById, getOrdersByAccountId, getOrders, createOrder, getOrderInfoById } = require("../controller/order");

const router = express.Router();

router.get("/", getOrders);
router.post("/", createOrder);
router.get("/account", getOrdersByAccountId);
router.get("/info", getOrderInfoById);
router.get("/details", getOrderDetailsById);

module.exports = router;