var express = require('express');
var router = express.Router();
var users_controller = require('../controllers/usersController');
let Travel = require('../models/travel');

//Register Form GET
router.get('/register',users_controller.get_register_page);

//Register proccess POST
router.post('/register', users_controller.register);

//login form
router.get('/login', users_controller.get_login_page);

//login process
router.post('/login', users_controller.login);

router.get('/logout', users_controller.logout);

//add new travel
router.get('/newTravel', users_controller.get_newTravel_page);

//add new travel
router.post('/newTravel', users_controller.add_newTravel);

router.get('/myAccount', function(req, res){

  res.render('myAccount')
});

router.get('/userTravels', users_controller.getusertravel);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('myAccount');
});


module.exports = router;
