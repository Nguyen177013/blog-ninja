const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requireUser = (req,res,next)=>{
    jwt.verify(req.cookies.jwt,process.env.HUTECH_TOKEN_SECRET, (err,decoded)=>{
        if(err){
            console.log('is null');
            res.redirect('/login')
        }
        else{
            console.log('not null');
            req.data = decoded;
            next();
        }
    });
}
const checkUser = (req, res, next)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,process.env.HUTECH_TOKEN_SECRET,async (err,decoded)=>{
            if(err){               
                res.locals.user = null;
                next();
            }
            else{
            if(decoded.admin ===true){
                const user = {admin:true,id:decoded.user,email:'admin'};
                req.data = user.id;
                res.locals.user = user;
            }
            else{
                const user =await User.findById(decoded.user);
                req.data = user._id;
                res.locals.user = user;
            }
            next();
            }
        });
    }
    else{
        // console.log('token is null');
        res.locals.user = null;
        next();
    }
}
module.exports = {requireUser,checkUser}