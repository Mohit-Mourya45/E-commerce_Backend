require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 9090 ;
const cors = require ('cors');
const mongoose = require ('mongoose');
const config = require ('./DB.js');
const stateRoute = require('./admin/state.route.js');
const cityRoute = require('./admin/city.route.js');
const bodyParser = require('body-parser');
const productcatgRoute = require('./admin/productcatg.route');
const vendorRoute = require('./vendor/vendor.route.js');
const customerRoute = require('./customer/customer.route.js');
const productRoute = require('./product/product.route.js');
const billRoute = require('./admin/bills/bill.route.js')
const saleRoute = require('./vendor/sales.route.js');
const paymentdetailsRoute = require('./admin/bills/paymentdetails.route.js');
const paymentRoute = require('./payment.js')

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());
app.use('/state',stateRoute);
app.use('/city',cityRoute);
app.use('/productcatg' , productcatgRoute);
app.use("/vendor",vendorRoute);
app.use("/customer",customerRoute);
app.use("/product",productRoute);
app.use("/bill",billRoute);
app.use("/sales", saleRoute);
app.use("/paymentdetails",paymentdetailsRoute);
app.use("/payment",paymentRoute);

mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log("Database connected successfully" + process.env.MONGODB_URL);
})
.catch (err => {
    console.log("Database connection error:", err);
});

app.get("/", (req, res) => {
    res.send("Backend API is running successfully 🚀");
});
app.listen(PORT,function() {
    console.log('Server is running on PORT: ',PORT);
});
