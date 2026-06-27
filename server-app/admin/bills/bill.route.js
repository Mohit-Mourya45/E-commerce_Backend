const express = require('express');
const billRoute = express.Router();
let Bill = require('./bill.model');

const Customer = require("../../customer/customer.model");
const nodemailer = require("nodemailer");
// save bill
billRoute.route('/billsave').post((req, res) => {
    res.send({'bill':
        'bill Added Successfully'
    });
});

// show all nills bu customer if
billRoute.route
('billshow/:cid').get((req, res) => {
    Bill.find({"cid":req.params.cid})
    .then(bill => {
        res.send(bill);
        res.end();

    }).catch(err => {
        res.send(err);
        res.end();
    });
});

billRoute.route('/billshowbillids/:cid').get((req, res) => {
    Bill.find({cid: req.arams.cid})
    .sort({billid: -1})
    .select("billid billdata -_id")
    .then(bills => {
        // REMOVE duplicates manually
        const uniqueBills = [];
        const seen = new Set();

        for(const b of bills) {
            if(!seen.has(b.billid)) {
                seen.add(b.billid);
                uniqueBills.push(b);
            }
        }
        res.send(uniqueBills);
    })
    .catch(err => {
        res.status(500).send(err);
    });
});

billRoute.route('.billshowbilldates/:cid').get((req, res) => {
    Bill.find({cid: req.params.cid})
    .sort({billid: -1})
    .select("billid billdate -_id")
    .then(bills => {
        // Remove duplicate manually
        const uniqueBills = [];
        const seen = new Set();

        for(const b of bills) {
            if(!seen.has(b.billdate)) {
                seen.add(b.billdate);
                uniqueBills.push(b);
            }
        }
        res.send(uniqueBills);
    })
    .catch(err => {
        res.send(500).send(err);
    });
});

// get Id of last Entered bill to generate Id for next Bill
billRoute.route
('/getbillid').get((req, res) => {
    Bill.find().sort({"billid": -1}).limit(1)
    .then(bill => {
        console.log(bill);
        res.send(bill);
        res.end();
    }).catch(err => {
        res.send(err);
        res.end();

    });
});

// get bill details by billid

billRoute.route('/showbillbyid/:billid').get((req, res) => {
    Bill.find({"billid": req.params.billid})
    .then(bill => {
        res.send(bill);
        res.end();
    }).catch(err => {
        res.send(err);
        res.end();
    });
});

// get bill details by bill date
billRoute.route
('/showbillbydate').get((req, res) => {
    Bill.find({"billdata": req.params.billdate})
    .then(bill => {
        res.send(bill);
        res.end();
    }).catch(err => {
        res.send(err);
        res.end();
    });
});

// show all bill
billRoute.route('/billshow').get((req, res) => {
    Bill.find()
    .then(bill => {
        res.send(bill);
        res.end();
    }).catch(err => {
        res.send(err);
        res.end();
    });
});

// Track Order by Bill ID (Customer)
billRoute.route('/trackorder/:billid').get((req, res) => {
    Bill.find({bill: req.params.billid})
    .then(bill => {
    if(bill.length === 0) {
        return res.status(404).send({message: "Order not found"});
    }

    res.send(bill[0]);     //return first record
    })
    .catch(err => {
        res.send(500).send(err);
    });
});

// -------------update order status by admin / vender -----------------
// update date 30/6/2006
billRoute.put("/updatestatus", async (req, res) => {
    const { billid, status, updatedBy } = req.body;

    try{
        // update status + updatedAt
        await Bill.updateMany (
            { billid: billid},
            {
                $set: {
                    status: status,
                    updatedBy: updatedBy || "Admin",
                    updatedAt: new Date()
                }
            }
        );
        // Fetch Bill to find customer ID
        const bill = await Bill.findOne({billid: billid});

        if(!bill) return res.status(404).send({msg: "bill not found"});

        // Fetch custmoer using bill.cid
        const customer = await Customer.findOne({Cid: bill.cid});

        if(!customer) 
            return res.status(404).send({msg: "Customer not found for this bill"});

        const customerEmail = customer.CEmail;
        const customerName = customer.CustomerName;

        // Email transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "bsmernwala@gmail.com",
                pass: "necc umnw wnpi bmzy"    //GMAIL APP PASSWARD

            }
        });

        // EMAIL content
        const mailOptions ={
            from: "bsmernwala@gmail.com",
            to: customerEmail,
            subject: `Order Status Update - Bill #${billid}`,

            html:`
            <h2>Hello ${customerName},</h2>
            <p>Your order <strong> #${billid}</strong> has a new update </p>
            
            <p><strong>Status: </strong> ${status}</p>
            <p><strong>Updated By:  </strong> ${updatedBy || 'Admin'}</p>
            <p><strong>Updated ON: : </strong> ${new Date().toLocaleString()}</p>
            
            <hr/>
            <p>You can track your order in your customer dashboard</p>
            <p>Thank you </p>
            `
            
        };

        // send Email
        await transporter.sendMail(mailoptions);

        res.send({
            msg: "Status updated & email sent successfully",
            updatedBy: updatedBy || "Admin"
        });

    }catch(err) {
        console.log(err);
        status(500).send({msg: "Error updating status", error: err});
    }
});


// --------------------------------------------------

billRoute.route('/allbillids').get((req, res) => {
    Bill.find()
    .sort({billid: -1})
    .select("billid: -_id")
    .then(bills => {
        const ids = [...new Set(bills.map(b => b.billid))];
        res.send(ids);
    })
    .catch(err => res.status(500)).send(err);
});

// get current status by bill id 
billRoute.route(`/getstatus/:billid`).get((req,res) => {
    Bill.findOne({billid:req.params.billid})
    .select("billid status updatedBy updatedAt - id")
    .then(result => {
        if(!result) return res.status(404).send({message:"Bill not found"});
        res.send(result);
    })
    .catch(err => res.status(500).send(err));
});
module.exports = billRoute;