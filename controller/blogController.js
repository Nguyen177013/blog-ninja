const Blog = require('../models/blog');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');

const index = async (req,res)=>{
    // console.log('this is data: ',req.data);
    const users = await User.find();
    const length = await Blog.find().count();
    const blogs = await (await Blog.find().sort({createdAt: -1}).limit(2)).map(blog=>{
        users.map(user=>{               
            if(user.id === blog.userId){
                blog.userId = (user.email)
            }
        })
        return blog;
    });
    // const userblog = await (await Blog.find()).map(blog=>mongoose.Types.ObjectId(blog.userId));
    // const user = await User.find({
    //     '_id':{$in:userblog}
    // })
    // console.log(user);
    res.render('index',{data:blogs,title:'blog',pages:length,selected:0})
}
const pages = async(req, res)=>{
    const length = await Blog.find().count();
    const page = req.params.p;
    const blogsperPage = 2;
    const users = await User.find();
    const blogs = await (await Blog.find().sort({createdAt: -1}).skip(page*blogsperPage).limit(2)).map(blog=>{
        users.map(user=>{               
            if(user.id === blog.userId){
                blog.userId = (user.email)
            }
        })
        return blog;
    });
    res.render('index',{data:blogs,title:'blog',pages:length,selected:page})
}
const create_get = (req,res)=>{
    res.render('create',{title:'create'});
}
const create_post = async (req,res)=>{
    try{
        const user = req.data.user;
        console.log('this is user', user);
        let body = req.body;
        body['userId'] = user;
        try{
            const blog = await Blog.create(body)
            res.redirect('/');
        }
        catch(err){
            console.log(err);
        }
    }
    catch(err){
        res.json(err);
    }
}
const uploadImg = (req,res)=>{
    // console.log(path.join(__dirname,'..','public','images'));
    fs.readFile(req.files.upload.path,function(err, data){
        var newPath = path.join(__dirname,'..','public','images',req.files.upload.name)
        console.log(newPath);
        fs.writeFile(newPath,data,function(err){
            if(err)console.log({err:err});
            else{
                console.log(req.files.upload.originalFilename);
                let fileName = req.files.upload.name;
                let url = '/images/'+fileName;
                let msg = 'Successfully uploaded';
                let funcNum = req.query.CKEditorFuncNum;
                console.log({url,msg,funcNum});
                res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('"+funcNum+"','"+url+"','"+msg+"');</script>");
            }
        })
    })
}
const detail_get = async (req,res)=>{
    let id = req.params.id;
    const getBlog = await Blog.findById(id)
    res.render('detail',{blog:getBlog,title:'detail'});
}
const edit_get = async (req, res) => {
    let id = req.params.id;
    const getBlog = await Blog.findById(id)
    res.render('edit',{blog:getBlog,title:'edit'});
}
const edit_patch = async (req, res) => {
    const edit = req.body;
    const id = req.params.id;
    try{
        let update = await Blog.findByIdAndUpdate(id, edit);
        res.redirect('/');
        // res.json('/')
    }
    catch(err){
        console.log(err);
    }
}
const delete_blog = async (req,res)=>{
    let id = req.params.id;
    try{
        let remove = await Blog.findByIdAndDelete(id);
        res.json('/');
    }
    catch(err){
        console.log(err);
    }
}
const blogData = async(req, res)=>{
    let page = req.params.p;
    const blogsPerPage = 2;
    const blogs = await Blog.find().skip(page*blogsPerPage).limit(blogsPerPage);
    res.json({blogs});
}
module.exports = {
    index,
    pages,
    create_get,
    create_post,
    uploadImg,
    detail_get,
    edit_get,
    edit_patch,
    delete_blog,
    blogData
}
