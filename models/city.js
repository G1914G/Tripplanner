const mongoose = require('mongoose');

var Schema = mongoose.Schema;

//country shema
const CitySchema = new Schema({
  name:{
     type:String,
     required: true
  },
  location:{
     type:String,
     required: true
  },
  description:{
    type:String,
    required: true
  },
  vacationhouses:{
    type:[{type:Schema.Types.ObjectId, ref: 'Vacationhouse'}],
    required:true
  },
  pictures:{
     type:[String],
     required: false
  }
});

const City = module.exports =mongoose.model('City', CitySchema);
