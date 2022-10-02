const jwt = require('jsonwebtoken');
const User = require('../models/user');
const context = require('../controller/userController')
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
                let _3day = 3 * 60 * 60 * 60 * 24 * 1000;
                const Refreshtoken = await context.refreshToken(token);
                res.cookie('jwt',Refreshtoken.token,{httpOnly:true,maxAge:_3day,secure:true});
                res.locals.user = Refreshtoken.user;
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
                console.log(user);
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