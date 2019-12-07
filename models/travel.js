const mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

//travel shema
const TravelSchema = new Schema({
    date_from:{
      type:Date,
      required: true
   },
    date_untill:{
      type:Date,
      required: true
   },
   id_country:{
      type:Schema.Types.ObjectId,
      ref: 'Country',
      required: true
    },
    id_user:{
       type:String,
       required: true
    },
    id_city:{
      type:Schema.Types.ObjectId,
      ref: 'City',
      required: true
     },
    id_vacationhouse:{
        type:Schema.Types.ObjectId,
        ref: 'Vacationhouse',
        required: true
    }
});

TravelSchema
.virtual('date_from_formatted')
.get(function () {
  return moment(this.date_from).format('MMMM Do, YYYY');
});

TravelSchema
.virtual('date_untill_formatted')
.get(function () {
  return moment(this.date_untill).format('MMMM Do, YYYY');
});

const Travel = module.exports =mongoose.model('Travel', TravelSchema);
