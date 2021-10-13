const mongoose = require('mongoose');

const ProductsSchema = new mongoose.Schema({
    name: {
        type: String, required: true
    },
    price: {
        type: Number, min: 0, required: true
    },
    photoPath: {
        type:String, required:false
    }
});

module.exports = mongoose.model('products', ProductsSchema);