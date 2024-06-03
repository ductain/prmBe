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
  const { email, accountPass, accountName, accountPhone, accountAddress } =
    req.body;

  // Check for missing fields
  if (
    !email ||
    !accountPass ||
    !accountName ||
    !accountPhone ||
    !accountAddress
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Check for password length
  if (accountPass.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long." });
  }

  try {
    // Check if email already exists
    if (await emailExists(email)) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(accountPass, 10);

    const pool = await sql.connect(config);
    await pool
      .request()
      .input("email", sql.VarChar, email)
      .input("accountPass", sql.VarChar, hashedPassword)
      .input("accountName", sql.NVarChar, accountName)
      .input("accountPhone", sql.VarChar, accountPhone)
      .input("accountAddress", sql.NVarChar, accountAddress)
      .query(
        "INSERT INTO ACCOUNT (EMAIL, ACCOUNTPASS, ACCOUNT_NAME, ACCOUNT_PHONE, ACCOUNT_ADDRESS) VALUES (@email, @accountPass, @accountName, @accountPhone, @accountAddress)"
      );

    res.status(200).json({ message: "Account registered successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, accountPass } = req.body;

  // Check for missing fields
  if (!email || !accountPass) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const pool = await sql.connect(config);
    const user = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM ACCOUNT WHERE EMAIL = @email");

    // Check if user exists
    if (user.recordset.length === 0) {
      return res.status(401).json({ message: "Email not existed." });
    }

    // Compare the hashed password
    const isValid = await bcrypt.compare(
      accountPass,
      user.recordset[0].ACCOUNTPASS
    );

    if (!isValid) {
      return res.status(401).json({ message: "Password is incorrect." });
    }

    // User authenticated
    const { ACCOUNTPASS, ...userWithoutPassword } = user.recordset[0];
    res
      .status(200)
      .json({ message: "Login successful.", user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register: register,
  login: login,
};
