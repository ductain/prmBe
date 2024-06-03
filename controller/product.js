const sql = require("mssql");
const config = require("../config/dbConfig");

const getProducts = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const products = await pool
      .request()
      .query(
        "SELECT PRODUCT_ID, PRODUCTNAME, ORIGIN, PRICE, PRODUCTDETAILS, PRODUCTMATERIAL, PR.TYPE_ID, T.TYPENAME, T.RATIO, T.HEIGHT, PR.BRAND_ID, BR.BRANDNAME FROM PRODUCT AS PR JOIN TYPES AS T ON PR.TYPE_ID = T.TYPE_ID JOIN BRAND AS BR ON PR.BRAND_ID = BR.BRAND_ID "
      );
    res.status(200).json({ products: products.recordset });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const getProductById = async (req, res) => {
  const productId = req.query.productId;
  try {
    const pool = await sql.connect(config);
    const product = await pool
      .request()
      .input("productId", sql.NVarChar, productId)
      .query(
        "SELECT PRODUCT_ID, PRODUCTNAME, ORIGIN, PRICE, PRODUCTDETAILS, PRODUCTMATERIAL, PR.TYPE_ID, T.TYPENAME, T.RATIO, T.HEIGHT, PR.BRAND_ID, BR.BRANDNAME FROM PRODUCT AS PR JOIN TYPES AS T ON PR.TYPE_ID = T.TYPE_ID JOIN BRAND AS BR ON PR.BRAND_ID = BR.BRAND_ID WHERE PRODUCT_ID = @productId "
      );
    if (product.recordset.length === 0) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.status(200).json({ product: product.recordset[0] });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports = {
  getProducts: getProducts,
  getProductById: getProductById,
};
