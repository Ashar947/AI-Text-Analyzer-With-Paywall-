const mongoose = require('mongoose');
require('dotenv').config();


const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    views:{
        type:Number,
        default:0
    },
    videoURL:{
        type:String,
    },                    
    image:{
        type:String,
        required:true
    }
    
})





module.exports = mongoose.model('Blog', blogSchema);
