const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const blogRouter = require('./router/blogRouter');
const userRouter = require('./router/userRouter');
const cookieParser = require("cookie-parser");
const {checkUser} = require('./middleware/authMiddleware')
const url = "mongodb+srv://Nguyen177013:Nguyen150801@cluster0.snsfek6.mongodb.net/note-tuts?retryWrites=true&w=majority";
const app = express();
const port = process.env.PORT || 3000;
// console.log(process.env.HUTECH_REFRESH_TOKEN)
const connect = async (url)=>{
    let routing = await mongoose.connect(url);
    app.listen(port,()=>{
        console.log('router đã được kích hoạt cổng 3000');
    })
}

connect(url);
app.set('view engine', 'ejs');
// middleware & static files
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'public','ckeditor')));

app.use(express.json()); //đọc file Json
app.use(express.urlencoded({ extended: false}));
app.use(morgan('dev'));

app.get('*',checkUser)
app.get('/',(req, res) => {
    req.params
        const token = req.cookies.jwt;
    res.redirect('blog');
});
app.get('/about',(req, res)=>{

    res.render('about',{title:'about'});
});
app.use('/blog',blogRouter);
app.use(userRouter);
app.use((req, res)=>{
    res.status(404).render('404',{title:404});
});

// console.log(process.env.HUTECH_TOKEN_SECRET);

