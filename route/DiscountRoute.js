/**
 * @swagger
 * components:
 *   schemas:
 *     Discount:
 *       type: object
 *       required:
 *         - DISCOUNTID
 *         - DISCOUNTRATE
 *       properties:
 *         DISCOUNTID:
 *           type: string
 *           description: The unique identifier for the discount
 *           example: "ss10"
 *         DISCOUNTRATE:
 *           type: integer
 *           description: The discount rate (percentage)
 *           example: 10
 *       example:
 *         DISCOUNTID: "ss10"
 *         DISCOUNTRATE: 10
 */

/**
 * @swagger
 * tags:
 *   name: Discounts
 *   description: API for managing discounts
 */

/**
 * @swagger
 * /discounts:
 *   get:
 *     summary: Get all discounts
 *     tags: [Discounts]
 *     responses:
 *       200:
 *         description: Successfully retrieved discounts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Discount'
 */

/**
 * @swagger
 * /discounts/{discountId}:
 *   get:
 *     summary: Get a discount by ID
 *     tags: [Discounts]
 *     parameters:
 *       - in: path
 *         name: discountId
 *         required: true
 *         description: Discount ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved discount
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Discount'
 *       404:
 *         description: Discount not found
 */

const express = require("express");
const { getDiscounts, getDiscountById } = require("../controller/discount");

const router = express.Router();

router.get("/", getDiscounts);
router.get("/:discountId", getDiscountById);

module.exports = router;