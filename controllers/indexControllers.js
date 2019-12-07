//Breng in User Model
let User = require('../models/user');
let City = require('../models/city');
let Country = require('../models/country');
let Travel = require('../models/travel');
let Vacationhouse = require('../models/vacationhouse');

//specific country page
exports.get_country_page = function(req, res){
  var country=req.params.country;
  // find all countrys who's name is the parameter geven with the req
  Country.find({ "name": country })
       .populate({path:'citys',populate:{path:'vacationhouses'}})
       .exec( function (err, countrys) {
         if(err){
           res.render('country',{title: 'geen land',
                                 description: 'Geen land in de database gevonden met deze naam!',
                                name:'N/A',
                                pictures:[],
                                yt:'N/A',
                                citys:[],
                                description:'N/A',
                                });
         }
         else{
          City.find({"name": countrys[0].citys})
          res.render('country',{
            country: countrys,
            name: countrys[0].name,
            locationlat: countrys[0].locationlat,
            locationlng: countrys[0].locationlng,
            pictures: countrys[0].pictures,
            yt: countrys[0].yt,
            citys: countrys[0].citys,
            description: countrys[0].description,
            descriptionyt: countrys[0].descriptionyt
            });
          }
          });
};

exports.get_myTravel = function(req, res){
  if(req.user){

    Travel.find({'id_user':req.user._id})
          .where('date_untill').gt(new Date())
          .populate('id_country')
          .populate('id_city')
          .populate('id_vacationhouse')
          .exec( function(err, travels) {
            if(err){
              res.render('myTravels',{errors:err})
            }
            else{
              if(travels.length==0){
                res.render('myTravels',{
                  travels:travels,
                  notravel:[]
                });
              }
              else{
                res.render('myTravels',{
                  travels:travels
                });
              }
            }
          });
    }
  else{
    res.render('login');
  }
};

exports.get_countries_page = function(req, res){
  Country.find()
           .exec( function (err, countrys) {
            if(err){
              res.render('countries',{countrys: 'geen land', citys:'geen stad', vacationhouses:'geen vakantie huizen'});
            }
            else{
              res.render('countries', {countrys: countrys});
            }
          });
};

exports.get_citys = function(req, res, next){
  var countryid=req.params.countryid;
  Country.findById(countryid, 'citys').populate('citys').exec(function(err, citys){
    if(err){
    }
    else{
      res.send(citys);
    }
  });
}

exports.get_vacationhouses = function(req, res, next){
  var cityid=req.params.cityid;
  City.findById(cityid, 'vacationhouses').populate('vacationhouses').exec(function(err, vacationhouses){
    if(err){
    }
    else{
      res.send(vacationhouses);
    }
  });
}

exports.get_blockeddates = function(req,res,next){
  var vacationhouseid=req.params.vacationhouseid;
  Vacationhouse.findById(vacationhouseid, 'notavailable').exec(function(err, disabledDates){
    if(err){
    }
    else{
      res.send(disabledDates);
    }
  });
}
