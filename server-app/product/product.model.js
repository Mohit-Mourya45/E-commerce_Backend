// product.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema ({
    pid: {type:Number , required:true , unique:true},
    pname: {type:String , required:true},
    pprice: {type:Number , required:true},
    oprice: {type:Number , required:true},
    ppicname: {type:String},
    pcatgid: {type:Number, required:true},
    vid: {type:Number},
    status: {type:String , default:"Inactive"},
    pdesc: {type:String , default:"This is a Branded Company Product"}
} , {
    collection : 'Product'
});

module.exports = mongoose.model('Product' , ProductSchema);