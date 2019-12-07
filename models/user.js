const mongoose = require('mongoose');

var Schema = mongoose.Schema;

//user shema
var UserSchema = new Schema({
   name:{
       type:String,
       required: true
   },
    email:{
       type:String,
       required: true
   },
    username:{
       type:String,
       required: true
   },
    password:{
       type:String,
       required: true
   }
});

const User = module.exports =mongoose.model('User', UserSchema);
