var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ProductCatg = new Schema ({
    pcatgid: {type:Number},
    pcatgname: {type:String},
    status: { type: Number }
},
{
    collection:'productcatg'
}
);
module.exports = mongoose.model('ProductCatg',ProductCatg);
