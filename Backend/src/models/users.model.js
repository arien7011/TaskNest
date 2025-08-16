import mongoose , {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema({
    userName:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        
    },
    avatar:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String
    }
},{timeStamps:true})

 userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
 })

 userSchema.methods.comparePassword = async function(password){
      const isPasswordCorrect = await bcrypt.compare(password,this.password);
      return isPasswordCorrect;
 }

 userSchema.methods.generateRefreshToken = async function(){
  return jwt.sign(
     {
        _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
   )
}
 

 userSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
       {
            _id:this._id,
            email:this.email,
            userName:this.userName,
            fullName:this.fullName
        },
       process.env.ACCESS_TOKEN_SECRET,
       {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    )
 }

export const User = mongoose.model("User",userSchema);

