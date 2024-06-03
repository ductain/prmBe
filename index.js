const express = require("express");
const port = 5000;

const app = express();

// import route
const productRoute = require("./route/ProductRoute");
const accountRoute = require("./route/AccountRoute")
const orderRoute = require("./route/OrderRoute")
const discountRoute = require("./route/DiscountRoute")

app.use(express.json());

app.use("/api/v1/products", productRoute);
app.use("/api/v1/users", accountRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/discounts", discountRoute);

app.listen(port, () => {
  console.log(`Backend is running at port ${port}`);
});
