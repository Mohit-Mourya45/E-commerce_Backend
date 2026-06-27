const express = require ('express');
const productcatgRoute = express.Router();
var ProductCatg = require('./productcatg.model');

//save product category
productcatgRoute.route('/addproductcatg').post( (req , res) =>{
     console.log("body", req.body);
    var productcatg=new ProductCatg({ pcatgid: req.body.pcatgid,pcatgname:req.body.pcatgname,status: req.body.status});
     

    productcatg.save().then(data => {
        res.json(data);
    }).catch(err => {
        console.log("Error:", err);
        res.send(err);
        res.end();
    });
});
//show all product category 
productcatgRoute.route
('/showproductcatg').
get(function ( req,res) {
    ProductCatg.find()
    .then(productcatg => {
        res.send(productcatg);
        res.end();
    })
    .catch(err => {
        res.send("Data not found somethinf went wrong");
        res.end();
    });
});
//update product catg
productcatgRoute.route
('/updateproductcatg/:pcatgid').
put(function ( req, res) {
    ProductCatg.updateOne({pcatgid:req.params.pcatgid},
        {pcatgname:req.body.pcatgname,status:req.body.status}
    ).then(()=> {
        res.send('product category added successfully');
        res.end();
    }).catch(err => {
        res.send(err);
        res.end();
    });
});
module.exports= productcatgRoute;  