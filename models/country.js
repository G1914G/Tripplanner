const mongoose = require('mongoose');

var Schema = mongoose.Schema;

//country shema
const CountrySchema = new Schema({
  name:{
     type:String,
     required: true
  },
  location:{
     type:String,
     required: true
  },
  pictures:{
     type:[String],
     required: false
  },
  yt:{
     type:String,
     required: false
  },
  description:{
    type:String,
    required: true
  },
  citys:{
    type:[{type:Schema.Types.ObjectId, ref: 'City'}],
    required:true
  }
});

const Country = module.exports =mongoose.model('Country', CountrySchema);
