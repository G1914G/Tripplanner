var express = require('express');
var router = express.Router();
var index_controller = require('../controllers/indexControllers');

let User = require('../models/user');
let Country = require('../models/country');
let City = require('../models/city');
let Vacationhouse = require('../models/vacationhouse');
let Travel = require('../models/travel');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/myTravels', index_controller.get_myTravel);

router.get('/countries', index_controller.get_countries_page);

router.get('/countries/:country', index_controller.get_country_page);

router.get('/countryid/:countryid', index_controller.get_citys);

router.get('/select/:cityid', index_controller.get_vacationhouses);

router.get('/selectdates/:vacationhouseid', index_controller.get_blockeddates);

module.exports = router;
