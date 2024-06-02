const express = require("express");
const port = 5000;

const app = express();

// import route
const productRoute = require("./route/ProductRoute");

app.use(express.json());

app.use("/api/v1/products", productRoute);

app.listen(port, () => {
  console.log(`Backend is running at port ${port}`);
});
