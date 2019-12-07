var bcrypt = require('bcryptjs');
var passport = require('passport');
var async = require('async');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

//Breng in User Model
let User = require('../models/user');
let Country = require('../models/country');
let City = require('../models/city');
let Vacationhouse = require('../models/vacationhouse');
let Travel = require('../models/travel');


//register form
exports.get_register_page = function(req, res){
    res.render('register');
};


//registreren
exports.register = function(req,res){
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('name', 'Naam is verplicht').notEmpty();
    req.checkBody('email', 'E-mailadres is verplicht').notEmpty();
    req.checkBody('email', 'E-mailadres adres is niet geldig').isEmail();
    req.checkBody('username', 'Gebruikersnaam is verplicht').notEmpty();
    req.checkBody('password', 'Vul een geldig wachtwoord in').notEmpty();
    req.checkBody('password','Wachtwoord moet minstens 6 karakters hebben').isLength({ min: 6});
    req.checkBody('password2', 'Wachtwoorden komen niet overeen').equals(req.body.password);

    let errors = req.validationErrors();

    if(errors){
        res.render('register',{
            errors:errors
        });
    }else{
        //checking if user already exists
        User.findOne({'username':username})
            .then(user => {
              if(user){
                //user exists
                errors=[{'msg':'Gebruikersnaam bestaat al'}];
                res.render('register',{
                    errors:errors
                });
              }

              else{
                //making new user
                let newUser = new User({
                    name:name,
                    email:email,
                    username:username,
                    password:password
                 });

                 //function of bcriptjs to encode the password--> safe
                 bcrypt.genSalt(10, function(err, salt){
                     bcrypt.hash(newUser.password, salt, function(err, hash){
                         if(err){
                             console.log(err);
                         }
                         newUser.password = hash;
                         newUser.save(function(err){
                             if(err){
                                console.log(err);
                                } else {
                                    req.flash('green','Proficiat je bent nu geregistreerd en je kunt inloggen!');
                                    res.redirect('/users/login');
                                }
                         })
                     });
                 });
              }
            });
        }
     };

//login form
exports.get_login_page = function(req, res){
    res.render('login');
};

//in loggen
exports.login = function(req, res, next){
    passport.authenticate('local', {successRedirect:'/',
                                   failureRedirect:'/users/login',
                                   failureFlash: true})(req, res, next);
};

//log out
exports.logout = function(req, res){
  req.logout();
  req.flash('green', 'Je bent uitgelogd');
  res.redirect('/users/login')
};

exports.get_newTravel_page = function(req, res){
  if(req.user){
    async.parallel({
        countrys: function(callback) {
            Country.find(callback);
        },
        citys: function(callback) {
            City.find(callback);
        },
        vacationhouses: function(callback) {
            Vacationhouse.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('newTravel', {countrys: results.countrys, citys: results.citys, vacationhouses: results.vacationhouses });
        });
    }
    else{
      res.render('login');
    }
};

exports.add_newTravel = [

    // Validate fields.
    body('country', 'Bestemming is niet opgegeven').isLength({ min: 1 }).trim(),
    body('city', 'Bestemming is niet opgegeven').isLength({ min: 1 }).trim(),
    body('vacationhouse', 'Bestemming is niet opgegeven').isLength({ min: 1 }).trim(),
    body('van', 'Je verblijfsduur is niet opgegeven').isLength({ min: 1 }).trim(),
    body('tot', 'Je verblijfsduur is niet opgegeven').isLength({ min: 1 }).trim(),

    sanitizeBody('*').escape(),
    sanitizeBody('van').toDate(),
    sanitizeBody('tot').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        var travel = new Travel(
          { date_from:req.body.van,
            date_untill:req.body.tot,
            id_country:req.body.country,
            id_user:req.user._id,
            id_city:req.body.city,
            id_vacationhouse: req.body.vacationhouse
           });

        if (!errors.isEmpty()) {

            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                countrys: function(callback) {
                    Country.find(callback);
                },
                citys: function(callback) {
                    City.find(callback);
                },
                vacationhouses: function(callback) {
                    Vacationhouse.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }
                res.render('newTravel', {countrys: results.countrys, citys: results.citys, vacationhouses: results.vacationhouses });
                });
            return;
        }
        else {
          //bezette datums huis aanpassen
          Vacationhouse.findById(req.body.vacationhouse, function(errs, vac){
            if(errs){}
            else{
            var Difference_In_Time = req.body.tot.getTime() - req.body.van.getTime();
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

            for (var i = 0; i < Difference_In_Days+1; i++) {
            var d=new Date(req.body.van);
            d.setDate(d.getDate()+i+1);
            vac.notavailable.push(d);
            }

            vac.save(function (err) {
              if (err) return handleError(err); // saved!
            });
          }
          });

            // Data from form is valid. Save book.
            travel.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new book record.
                   res.redirect('/myTravels');
                });
        }
    }
];

exports.getusertravel = function(req,res,next){
    var userid=req.user;
    Travel.find({'id_user':userid._id}).where('date_untill').gt(new Date()).exec(function(err, travels){
      if(err){
      }
      else{
        res.send(travels);
      }
    });
  }
