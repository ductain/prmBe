const sql = require("mssql");
const bcrypt = require("bcrypt");
const config = require("../config/dbConfig");

// Helper function to check if email already exists
const emailExists = async (email) => {
  const pool = await sql.connect(config);
  const result = await pool
    .request()
    .input("email", sql.VarChar(50), email)
    .query("SELECT * FROM ACCOUNT WHERE EMAIL = @email");
  return result.recordset.length > 0;
};

const register = async (req, res) => {
  const { EMAIL, ACCOUNTPASS, ACCOUNT_NAME, ACCOUNT_PHONE, ACCOUNT_ADDRESS } =
    req.body;

  // Check for missing fields
  if (
    !EMAIL ||
    !ACCOUNTPASS ||
    !ACCOUNT_NAME ||
    !ACCOUNT_PHONE ||
    !ACCOUNT_ADDRESS
  ) {
    return res.status(400).json({error: "All fields are required."});
  }

  // Check for password length
  if (ACCOUNTPASS.length < 6) {
    return res.status(400).json({error: "Password must be at least 6 characters long."});
  }

  try {
    // Check if email already exists
    if (await emailExists(EMAIL)) {
      return res.status(400).json({error: "Email already in use."});
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(ACCOUNTPASS, 10);

    const pool = await sql.connect(config);
    await pool
      .request()
      .input("email", sql.VarChar, EMAIL)
      .input("accountPass", sql.VarChar, hashedPassword)
      .input("accountName", sql.NVarChar, ACCOUNT_NAME)
      .input("accountPhone", sql.VarChar, ACCOUNT_PHONE)
      .input("accountAddress", sql.NVarChar, ACCOUNT_ADDRESS)
      .query(
        "INSERT INTO ACCOUNT (EMAIL, ACCOUNTPASS, ACCOUNT_NAME, ACCOUNT_PHONE, ACCOUNT_ADDRESS) VALUES (@email, @accountPass, @accountName, @accountPhone, @accountAddress)"
      );
    const result = await pool
      .request()
      .input("email", sql.VarChar(50), EMAIL)
      .query("SELECT * FROM ACCOUNT WHERE EMAIL = @email");
    res.status(200).json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { EMAIL, ACCOUNTPASS } = req.body;

  // Check for missing fields
  if (!EMAIL || !ACCOUNTPASS) {
    return res.status(400).json({error: "Email and password are required."});
  }

  try {
    const pool = await sql.connect(config);
    const user = await pool
      .request()
      .input("email", sql.VarChar, EMAIL)
      .query("SELECT * FROM ACCOUNT WHERE EMAIL = @email");

    // Check if user exists
    if (user.recordset.length === 0) {
      return res.status(401).json({error: "Email not existed."});
    }

    // Compare the hashed password
    const isValid = await bcrypt.compare(
      ACCOUNTPASS,
      user.recordset[0].ACCOUNTPASS
    );

    if (!isValid) {
      return res.status(401).json({error: "Password is incorrect."});
    }

    // User authenticated
    const { ACCOUNTPASS, ...userWithoutPassword } = user.recordset[0];
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register: register,
  login: login,
};
