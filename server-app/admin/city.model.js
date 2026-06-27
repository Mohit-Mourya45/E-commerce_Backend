// city.model.js
var mongoose  = require('mongoose');                                                                                                                                                                                                                                                           var mangoose = require('mongoose');
const Schema = mongoose.Schema;
var City = new Schema({
    ctid:{type:Number},
    ctname:{type:String},
    stid:{type:Number},
    stname:{type:String},
    status: { type: Number ,default :1} 
    },
    {
        collection:'city'
    }
);
module.exports = mongoose.model('City', City);