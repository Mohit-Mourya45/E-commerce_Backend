require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const stateRoute = require("./admin/state.route.js");
const cityRoute = require("./admin/city.route.js");
const productcatgRoute = require("./admin/productcatg.route");
const vendorRoute = require("./vendor/vendor.route.js");
const customerRoute = require("./customer/customer.route.js");
const productRoute = require("./product/product.route.js");
const billRoute = require("./admin/bills/bill.route.js");
const saleRoute = require("./vendor/sales.route.js");
const paymentdetailsRoute = require("./admin/bills/paymentdetails.route.js");
const paymentRoute = require("./payment.js");

// 🔥 FIXED CORS (IMPORTANT)
app.use(
  cors({
    origin: "https://e-commerce-frontend-sage-one.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use("/state", stateRoute);
app.use("/city", cityRoute);
app.use("/productcatg", productcatgRoute);
app.use("/vendor", vendorRoute);
app.use("/customer", customerRoute);
app.use("/product", productRoute);
app.use("/bill", billRoute);
app.use("/sales", saleRoute);
app.use("/paymentdetails", paymentdetailsRoute);
app.use("/payment", paymentRoute);

// MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("DB error:", err);
  });

// Test route
app.get("/", (req, res) => {
  res.send("Backend API is running successfully 🚀");
});

// ❌ IMPORTANT: REMOVE app.listen FOR VERCEL
module.exports = app;