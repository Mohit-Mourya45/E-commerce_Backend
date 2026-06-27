
    const express =require('express');
    const venderRoute = express.Router();
    const Vender = require("./vendor.model");
    const multer = require("multer");
    const path = require("path");
    const nodemailer = require("nodemailer");
    const { CloudinaryStorage } = require("multer-storage-cloudinary");
    const cloudinary = require('cloudinary').v2;
    require("dotenv").config();


    // Cloudinary config
    cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    });







    // const cloudinary = require("../cloudinary");        
    //Import config(shown below)

    //  =================================================================
    // Multer Cloudinary Storage
    // ==================================================================
    const storage = new CloudinaryStorage({
        cloudinary,
        params: {
            folder: "vendor_images",               //Folder name in Cloudinary
            allowed_formats: ["jpg", "png", "jpeg", "webp"],
            public_id: (req, file) => Date.now() + "-" + file.originalname,

        },
    });

    const upload = multer({storage});


    // ===================================================================
    // Vendor Registration
    // ===================================================================

    venderRoute.post("/register", async (req, res) => {
        try {
            const exists = await Vender.findOne({
                $or: [{VUserId: req.body.VUserId }, {
                    VEmail: req.body.VEmail }],
            });
            if(exists) return res.status(400).send("VUserId or VEmail already exists");

            const maxVidDoc = await Vender.findOne().sort({Vid: -1});
            const newVid = maxVidDoc ? maxVidDoc.Vid + 1 : 1;

            const vender = new Vender({...req.body, Vid:newVid });
            await vender.save();
            sendGMail(vender.VEmail);
            res.send("Registration Successfully");
        
        
        }
        catch(err) {
            console.error(err);
            res.status(400).send("RegistrationFailed");
        }
    });

    // ==============================================================
    // LOgin
    // ==============================================================

    venderRoute.post("/login", async(req, res) => {
        const { vuid, vupass } = req.body;
        try{
            const vender = await Vender.findOne({VUserId: vuid, VUserPass: vupass });
            if(!vender) return res.status(404).send("Invalid credentials");
            res.send(vender);

        }
        catch(err) {
            res.status(500).send("Something went wrong");

        }
    });

    // ================================================================
    // Get aLl Vendors
    // ================================================================
    venderRoute.get("/getvendorcount", async(req, res) => {
        try{
            const vendors = await Vender.find();
            res.send(vendors);
        }
        catch(err) {
            res.status(500).send("Something went Worng");

        }
    });

    // =======================================
    // Toggle Vendor Status
    // =======================================
    venderRoute.put("/vendermanage/:vid/:status", async(req, res) => {
        try{await Vender.updateOne(
            { Vid: req.params.vid},
            {Status: req.params.status}
            );
        res.send("VenderStatus Updated Successfully");
        } catch(err) {
            res.status(500).send(err)

        }
    });


    // ======================================================
    // Update Vendor Profile (with Cloudinary upload)
    // ======================================================

    venderRoute.put("/update/:VUserId", async(req, res) => {
        try{
            const VUserId = req.params.VUserId;
            const vendor = await Vender.findOne({ VUserId });
            if(!vendor) return res.status(404).send("Vendor not found");

            // Multer will not handle files unless we add upload.single("file") middleware

            const uploadMiddleware = upload.single("file");

            uploadMiddleware(req, res, async(err) => {
                if(err) {
                    console.error("multer/Cloudinary error:",err);
                    return res.status(500).send("File Upload failed");
                }
                const updateData = {
                    VenderName: req.body.VenderName || vendor.VenderName,
                    VAddress: req.body.VAddress || vendor.VAddress,
                    VContact: req.body.VContact || vendor.VContact,
                    VEmail: req.body.VEmail || vendor.VEmail,
                    VPicName: req.file ? req.file.path : vendor.VPicName,     //Cloudinary image URL
                };

                await Vender.updateOne({VUserId}, {$set: updateData });

                res.send({
                    message: "Profile updated successfully", updateData,
                });
            });

        } catch(err) {
            console.error(err);
            res.status(500).send("Error updatung profile");
            
        }
    });

    // EMAIL FUNCTION

    function sendGMail(mailto) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASS,
            },
        });
        transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: mailto,
            subject: "Vendor Registration Successful.",
            text: "Dear Vendor, yur registraction is successfu;. Admin approval is required before login.",
        });
        console.log("Mail sent to Vendor");
    }

    // ==========================================================
    // Forget Passward (OTP)
    // ==========================================================

    // let otpStore = {};       temporary storage

    // send OTP

    module.exports = venderRoute;