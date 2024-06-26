const express = require("express"),
  bodyParser = require("body-parser"),
  swaggerJsdoc = require("swagger-jsdoc"),
  swaggerUi = require("swagger-ui-express");

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

const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.9/swagger-ui.min.css";
const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "GundamShopMobile's API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "LogRocket",
        url: "https://logrocket.com",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: "https://prm-be.vercel.app/api/v1",
      },
      {
        url: "http://localhost:5000/api/v1",
      },
    ],
  },
  apis: ["./route/*.js"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { customCssUrl: CSS_URL })
);

app.listen(port, () => {
  console.log(`Backend is running at port ${port}`);
});
