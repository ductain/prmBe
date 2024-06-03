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
        res.status(200).json({ discounts: discounts.recordset });
    } catch (error) {
        res.status(500).json({ error: error });
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
                "SELECT * FROM DISCOUNT WHERE DISCOUNT_ID = @discountId"
            );
        if (discount.recordset.length === 0) {
            res.status(404).json({ error: "Không tìm thấy mã giảm giá" });
        } else {
            res.status(200).json({ discount: discount.recordset[0] });
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

module.exports = {
    getDiscounts: getDiscounts,
    getDiscountById: getDiscountById,
};
