const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    snippet:{
        type:String,
        required:true,
    },
    body:{
        type:String,
        required:true,
    }
},{timestamps:true})
    const Blog = mongoose.model('blogs',blogSchema);
    module.exports = Blog;