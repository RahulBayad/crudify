const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    item:String,
    type:String,
    Price:Number
})

exports.module = mongoose.model('products', productSchema);

