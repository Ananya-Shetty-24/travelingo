const mongoose= require('mongoose');
const Schema =mongoose.Schema;

const userSchema= new Schema({
    name:String,
    email:String,
    role:{
        type:String,
        enum:['user','admin'],
        default:"user",
    },
    passwordHash:String
})

const UserModel=mongoose.model('UserModel',userSchema);
module.exports=UserModel