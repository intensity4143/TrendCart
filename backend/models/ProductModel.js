const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    detailedDescription: {
        type: String,
        default: '',
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: Array,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    subCategory: {
        type: String,
        required: true,
    },
    sizes: {
        type: Array,
        required: true,
    },
    bestseller: {
        type: Boolean,
        default: false
        // required: true,
    },
    date: {
        type: Number, 
        required:true,
    }
},
{timestamps:true}
) 

module.exports = mongoose.model("Product", productSchema);