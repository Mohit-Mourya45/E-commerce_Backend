const express = require('express');
const productcatgRoute = express.Router();
const ProductCatg = require('./productcatg.model');

console.log("Schema Loaded:", ProductCatg.schema.obj);

/* ================= SAVE PRODUCT CATEGORY ================= */

productcatgRoute.post('/addproductcatg', async (req, res) => {
    try {
        console.log("Body:", req.body);

        const productcatg = new ProductCatg({
            pcatgid: req.body.pcatgid,
            pcatgname: req.body.pcatgname,
            status: req.body.status
        });

        const data = await productcatg.save();

        res.status(201).json(data);
    }
    catch (err) {
        console.log("Add Category Error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


/* ================= SHOW ALL PRODUCT CATEGORIES ================= */

productcatgRoute.get('/showproductcatg', async (req, res) => {
    try {
        const productcatg = await ProductCatg.find();

        res.status(200).json(productcatg);
    }
    catch (err) {
        console.log("Show Category Error:", err);

        // Always return an array to avoid React crashes
        res.status(500).json([]);
    }
});


/* ================= UPDATE PRODUCT CATEGORY ================= */

productcatgRoute.put('/updateproductcatg/:pcatgid', async (req, res) => {
    try {
        await ProductCatg.updateOne(
            { pcatgid: req.params.pcatgid },
            {
                $set: {
                    pcatgname: req.body.pcatgname,
                    status: req.body.status
                }
            }
        );

        res.status(200).json({
            success: true,
            message: "Product category updated successfully"
        });
    }
    catch (err) {
        console.log("Update Category Error:", err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = productcatgRoute;