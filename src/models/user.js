const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
     } ,
    email:{
         type:String,
         unique:true,
         trim:true,
         required:true,
         lowercase:true,
         validate(value){
             if(!validator.isEmail(value)){
                 throw new Error('Email Id  not valid')
             }
         }
     },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value <0){
                throw new Error('Age cannot be less than 0');
            }
        }
     },
     password:{
         type:String,
         trim:true,
         required:true,
         minlength:7,
         validate(value){
             if(value.toLowerCase().includes('password')){
                 throw new Error('Password is weak');
             }
         }
     },
     tokens:[{
         token:{
             type:String,
             required:true
         }
     }],
     avatar:{
         type:Buffer
     }
 },{
     timestamps:true
 });

 userSchema.virtual('tasks',{
     ref:'Tasks',
     localField:'_id',
     foreignField:'owner'
 })

 userSchema.methods.generateAuthToken = async function (){
    const token = jwt.sign({_id:this._id.toString()},process.env.JWT_SECRET);
    this.tokens = this.tokens.concat({token});
    await this.save();
    return token;
 }

 userSchema.methods.toJSON = function() {
     const userObject = this.toObject();

     delete userObject.password;
     delete userObject.tokens;
     delete userObject.avatar;
     return userObject;
 }

 userSchema.statics.findByCredentials = async (email,password) =>{
     
     const user = await User.findOne({email});
     
     if(!user){
         return {error:'Unable to login'};
     }
     
     const isMatch = await bcrypt.compare(password,user.password);

     if(!isMatch){
        return {error:'Unable to login'};
     }

     return user;
 }

 userSchema.pre('save', async function(next){

    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,8);
    }

     next();
 })

 userSchema.pre('remove',async function(next){
    await Task.deleteMany({owner:this._id});
    next();
 })

const User = mongoose.model('User',userSchema);

 module.exports = User;