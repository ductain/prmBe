const sql = require("mssql");
const config = require("../config/dbConfig");

const getProducts = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const products = await pool
      .request()
      .query(
        "SELECT PRODUCT_ID, PRODUCTNAME, ORIGIN, PRICE, PRODUCTDETAILS, PRODUCTMATERIAL, QUANTITY, PRODUCTIMAGE, PR.TYPE_ID, T.TYPENAME, T.RATIO, T.HEIGHT, PR.BRAND_ID, BR.BRANDNAME FROM PRODUCT AS PR JOIN TYPES AS T ON PR.TYPE_ID = T.TYPE_ID JOIN BRAND AS BR ON PR.BRAND_ID = BR.BRAND_ID "
      );
    res.status(200).json(products.recordset);
  } catch (error) {
    res.status(500).json(error);
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
        "SELECT PRODUCT_ID, PRODUCTNAME, ORIGIN, PRICE, PRODUCTDETAILS, PRODUCTMATERIAL, QUANTITY, PRODUCTIMAGE, PR.TYPE_ID, T.TYPENAME, T.RATIO, T.HEIGHT, PR.BRAND_ID, BR.BRANDNAME FROM PRODUCT AS PR JOIN TYPES AS T ON PR.TYPE_ID = T.TYPE_ID JOIN BRAND AS BR ON PR.BRAND_ID = BR.BRAND_ID WHERE PRODUCT_ID = @productId "
      );
    if (product.recordset.length === 0) {
      res.status(404).json("Product not found");
    } else {
      res.status(200).json(product.recordset[0]);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const getFiveRandomProductsDaily = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const dateSeed = new Date().setHours(0, 0, 0, 0); // Reset time to midnight for daily seed
    const products = await pool.request().query(
      `SELECT TOP 5 PRODUCT_ID, PRODUCTNAME, ORIGIN, PRICE, PRODUCTDETAILS, PRODUCTMATERIAL, QUANTITY, PRODUCTIMAGE, PR.TYPE_ID, T.TYPENAME, T.RATIO, T.HEIGHT, PR.BRAND_ID, BR.BRANDNAME
         FROM PRODUCT AS PR
         JOIN TYPES AS T ON PR.TYPE_ID = T.TYPE_ID
         JOIN BRAND AS BR ON PR.BRAND_ID = BR.BRAND_ID
         ORDER BY CHECKSUM(NEWID(), ${dateSeed})`
    );
    res.status(200).json(products.recordset);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching random products", error: error });
  }
};

module.exports = {
  getProducts: getProducts,
  getProductById: getProductById,
  getFiveRandomProductsDaily: getFiveRandomProductsDaily,
};
