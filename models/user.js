const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        validate:[isEmail,'please enter a valid email'],
    },
    password:{
        type:String,
        required:true,
        minlength: [6,'please enter a valid password']
    }
})
userSchema.pre('save',async function (next){
    const salt = await bcrypt.genSalt(10);
    this.password = bcrypt.hashSync(this.password, salt);
    next();
})
userSchema.statics.login = async function (email,password){
    const user = await this.findOne({email});
    if(user){
        const checkPassword = await bcrypt.compare(password,user.password)
        if(checkPassword){
            return user;
        }
        else
        throw Error('password');
    }
    throw Error('email');
}
userSchema.statics.checkMail = async function(email){
    const user = await this.findOne({email}); 
    if(user){
        return user;
    }
    else{
        console.log('email không tồn tại -41.user.js');
        throw Error('email');
    }
}
const User = mongoose.model('users',userSchema);
module.exports = User;
