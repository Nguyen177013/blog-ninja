const User = require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
let _3days = 3 * 24 * 60 *60;
require('dotenv').config()
const handleError = (err) => {
  let error = { email: "", password: "" };
  if (err.message === "email") error.email = "Can not find this email";
  if (err.message === "password") error.password = "This password is wrong";

  if (err.code === 11000) error.email = "this email is already used";

  if (err.message.includes("users validation failed")) {
    Object.values(err.errors).forEach((err) => {
      error[err.path] = err.message;
    });
  }
  return error;
};
const createToken = (user, admin = false) => {
  return jwt.sign({ user, admin }, process.env.HUTECH_TOKEN_SECRET, { expiresIn: process.env.HUTECH_TOKEN_LIFE });
};
const refreshToken = async (token)=>{
  const accessToken = token;
  if(accessToken){
    const decoded = jwt.verify(accessToken,process.env.HUTECH_TOKEN_SECRET,{ignoreExpiration: true});
    if(decoded){
      const user = {
        user:decoded.user,
        admin:decoded.admin
      };
      return {token: createToken(user.user,user.admin),user:await User.findById(decoded.user)}
    }
  }
}
const login_get = (req, res) => {
  res.render("login", { title: "Login" });
};
const sendEmail_get = (req, res) => {
  res.render("mail/mail", { title: "Send Email" });
};
// send mail method
const sendEmail_post = async (req, res) => {

  const { email } = req.body;
  try {
    const user = await User.checkMail(email);
    // // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "ngocsieukibo@gmail.com", // generated ethereal user
        pass: "oclynxhageikuvvm", // generated ethereal password
      },
    });
    const msg = {
      from: '"Blog Ninja" <gocsieukibo@gmail.com>', // sender address
      to: `${email}`, // list of receivers
      subject: "Forgot Password", // Subject line
      // text: "We've receive the request that you've forgotten your password", // plain text body
      html: "<h4>We've receive the request that you've forgotten your password</h4><p>Click here to type the new one</p>", // html body
    };
    await transporter.sendMail(msg, function (err, success) {
      if (err) console.log(err);
      else console.log("Gửi mail thành công!!");
      res.status(201).json({user:user})
    });
  } catch (err) {
    let error = handleError(err);
    res.status(401).json({ error });
  }
};
const signup_get = (req, res) => {
  res.render("signup", { title: "Sign up" });
};
const signup_post = async (req, res) => {
  let data = req.body;
  try{
       const user = await User.create(data);
      const token = createToken(user._id);
      console.log(token);
      res.cookie('jwt',token,{httpOnly:true,maxAge:_3days*1000,secure:true});
      res.status(201).json({user:user._id});
  }
  catch(err){
      let errors = handleErrors(err);
      res.status(401).json({errors});
  }      
};
const login_post = async (req, res) => {
  const { email, password } = req.body;
  let token = "";
  try {
    const user = await User.login(email, password);
    if (user.email === "admin@gmail.com") {
      token = createToken(user._id, true);
    } else {
      token = createToken(user._id);
    }
    res.cookie("jwt", token, { maxAge: _3days*1000, httpOnly: true,});
    res.status(201).json({ user: user._id });
  } catch (err) {
    let error = handleError(err);
    console.log(err.message);
    res.status(401).json({ error });
  }
};
const logOut_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1, httpOnly: true, secure: true });
  res.redirect("/");
};
const data = async (req, res) => { 
  const page = req.query.p || 0;
  const userPerpage = 3;
  const data = await User.find()
  .sort({"_id":-1})
  .skip(page*userPerpage)
  .limit(userPerpage);
  console.log(data);
  res.json(data);
}
module.exports = {
  login_get,
  signup_get,
  signup_post,
  login_post,
  logOut_get,
  sendEmail_get,
  sendEmail_post,
  refreshToken,
  data
};
