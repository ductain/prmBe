const sql = require("mssql");
const config = require("../config/dbConfig");

const getOrders = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const orders = await pool
            .request()
            .query(
                "SELECT * FROM ORDERS"
            );
        res.status(200).json(orders.recordset);
    } catch (error) {
        res.status(500).json(error);
    }
};

const getOrderDetailsById = async (req, res) => {
    const orderId = req.params.orderId;
    try {
        const pool = await sql.connect(config);
        const orderItems = await pool
            .request()
            .input("orderId", sql.Int, orderId)
            .query(
                "SELECT * FROM ORDERDETAILS WHERE ORDER_ID = @orderId"
            );
        if (orderItems.recordset.length === 0) {
            res.status(404).json("Không tìm thấy thông tin đơn hàng");
        } else {
            res.status(200).json(orderItems.recordset);
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

const getOrdersByAccountId = async (req, res) => {
    const accountId = req.query.accountId;
    try {
        const pool = await sql.connect(config);
        const orders = await pool
            .request()
            .input("accountId", sql.Int, accountId)
            .query(
                "SELECT * FROM ORDERS WHERE ACCOUNT_ID = @accountId"
            );
        if (orders.recordset.length === 0) {
            res.status(404).json("Không tìm thấy danh sách đơn hàng");
        } else {
            res.status(200).json(orders.recordset);
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

const createOrder = async (req, res) => {
    // const { cart, accountId, total, orderNote, paymentMethod } = req.body;
    const { cart, order } = req.body;
    const { accountId, total, orderNote, paymentMethod } = order;
    const cartArray = JSON.parse(cart); // Assuming cart is an array of objects
    const curDateTime = new Date();
    const orderDate = curDateTime.toISOString(); // ISO 8601 format

    // Check for missing fields
    if (!accountId || !total || !paymentMethod) {
        return res.status(400).json("Vui lòng điển đủ thông tin");
    }

    try {
        const pool = await sql.connect(config);
        const insertedOrderResult = await pool
            .request()
            .input("orderDate", sql.DateTime, orderDate)
            .input("accountId", sql.Int, accountId)
            .input("total", sql.Float, total)
            .input("orderNote", sql.NVarChar, orderNote)
            .input("paymentMethod", sql.NVarChar, paymentMethod)
            .query(
                "INSERT INTO ORDERS (ORDER_DATE, ACCOUNT_ID, TOTALMONEY, ORDER_NOTE, PAYMENTMETHOD) VALUES (@orderDate, @accountId, @total, @orderNote, @paymentMethod); SELECT SCOPE_IDENTITY() AS NewOrderID;"
            );

        const newOrderId = insertedOrderResult.recordset[0].NewOrderID;

        // Insert orderDetails for each item in the cart
        for (const item of cartArray) {
            const request = pool.request(); // Create a new request object
            request.input("order_id", sql.Int, newOrderId);
            request.input("product_id", sql.NVarChar, item.productId);
            request.input("quantity", sql.Int, item.quantity);
            request.input("unit_price", sql.Float, item.unitPrice);
            await request.query(`
                INSERT INTO ORDERDETAILS (ORDER_ID, PRODUCT_ID, QUANTITY, UNITPRICE)
                VALUES (@order_id, @product_id, @quantity, @unit_price);
            `);
        }

        res.status(200).json("Đơn hàng đã được khởi tạo");
    } catch (error) {
        res.status(500).json(error);
    }
};


module.exports = {
    getOrders: getOrders,
    getOrderDetailsById: getOrderDetailsById,
    getOrdersByAccountId: getOrdersByAccountId,
    createOrder: createOrder,
};
