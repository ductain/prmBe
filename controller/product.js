const sql = require("mssql");
const config = require("../config/dbConfig");

const getProducts = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const products = await pool.request().query("SELECT * FROM PRODUCT ");
    res.status(200).json({ products: products.recordset });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports = {
  getProducts: getProducts,
};
