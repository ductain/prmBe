const sql = require("mssql");
const config = require("../config/dbConfig");

const getDiscounts = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const discounts = await pool
            .request()
            .query(
                "SELECT * FROM DISCOUNT"
            );
        res.status(200).json(discounts.recordset);
    } catch (error) {
        res.status(500).json(error);
    }
};

const getDiscountById = async (req, res) => {
    const discountId = req.params.discountId;
    try {
        const pool = await sql.connect(config);
        const discount = await pool
            .request()
            .input("discountId", sql.VarChar, discountId)
            .query(
                "SELECT * FROM DISCOUNT WHERE DISCOUNTID = @discountId"
            );
        if (discount.recordset.length === 0) {
            res.status(404).json("Không tìm thấy mã giảm giá");
        } else {
            res.status(200).json(discount.recordset[0]);
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    getDiscounts: getDiscounts,
    getDiscountById: getDiscountById,
};
