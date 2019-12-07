const mongoose = require('mongoose');

var Schema = mongoose.Schema;

//vactaionhouse shema
const VacationHouseSchema = new Schema({
  description:{
    type:String
  },
  picture:{
    type:String,
    required:true
  },
  location:{
     type:String,
     required:true
  },
  price:{
     type:Number
  },
  name:{
     type:String
  },
  notavailable:{
     type:[Date]
  },
  capacity:{
     type:Number
  }
});

const Vacationhouse = module.exports =mongoose.model('Vacationhouse', VacationHouseSchema);
