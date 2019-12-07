#! /usr/bin/env node

console.log('This script populates our database. Specified database as argument mongodb+srv://Glenn:GlSi2019@cluster0-0ayg3.gcp.mongodb.net/tripplanner?retryWrites=true&w=majority');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var City = require('./models/city')
var Country = require('./models/country')
var Vacationhouse = require('./models/vacationhouse')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var cities = []
var countries = []
var vacationhouses = []
var notavailable = []

function vacationhouseCreate(name, description, location, notavailable, capacity, price, picture, cb) {
  vacationhousedetail = {name:name, description:description, location:location, capacity:capacity, price:price, picture:picture }
  if (notavailable != false) vacationhousedetail.notavailable = notavailable

  var vacationhouse = new Vacationhouse(vacationhousedetail);

  vacationhouse.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New vacationhouse: ' + vacationhouse);
    vacationhouses.push(vacationhouse)
    cb(null, vacationhouse)
  }  );
}

function cityCreate(name, location, description, vacationhouses, pictures, cb) {
  citydetail = {
    name: name,
    location:location,
    description: description,
    pictures: pictures
  }
  if (vacationhouses != false) citydetail.vacationhouses = vacationhouses

  var city = new City(citydetail);
  city.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New City: ' + city);
    cities.push(city)
    cb(null, city)
  }  );
}


function countryCreate(name, location, pictures, yt, description, citys, cb) {
  countrydetail = {
    name:name,
    location:location,
    yt:yt,
    description:description
  }
  if (pictures != false) countrydetail.pictures = pictures
  if (citys != false) countrydetail.citys = citys

  var country = new Country(countrydetail);
  country.save(function (err) {
    if (err) {
      console.log('ERROR CREATING country: ' + country);
      cb(err, null)
      return
    }
    console.log('New Country: ' + country);
    countries.push(country)
    cb(null, country)
  }  );
}


function createVacationhouses(cb) {
    async.series([
        function(callback) {
          vacationhouseCreate('Villa Italië', 'Moderne villa dicht gelegen bij Rome en de zee. Alle comfort aanwezig inclusief zwembad. Geschikt voor grote gezinnen. Bedlinnen en wifi zijn aanwezig.', 'Ostia+Rome+Italië', notavailable, '8', '250','villa_italy.jpg', callback);
        },
        function(callback) {
          vacationhouseCreate('Hotel pizzeria', 'Dit hotel biedt alle comfort die u wilt op vakantie. Ons hotel heeft een fantastische pizzeria. Wifi en bubbelbad zijn aanwezig in de accomodaties. Huisdieren zijn niet toegestaan.', 'Portici+Napels+Italië', notavailable, '5', '223','house1_italy.jpg', callback);
        },
        function(callback) {
          vacationhouseCreate('Stranda Yellow House', 'Klein gezellig huisje met alle benodigdheden waaronder bedlinnen. U hebt de mogelijkheid tot huren van een boot om de fjorden te verkennen. Dit vakantiehuis heeft gratis wifi en is dicht gelegen bij het Geiranger Fjord.', 'Valldal+Noorwegen', notavailable, '5', '125','house_norway.jpg', callback);
        },
        function(callback) {
          vacationhouseCreate('Camping fjord', 'Ben je een avonturier dan is deze kampeerplaats midden in de natuur zeker iets voor jou! De camping biedt alle faciliteiten om je verblijf zo aangenaam mogelijk te maken. Tevens is er een mogelijkheid tot het huren van hutten van 4 tot 6 personen. U kunt genieten van een prachtig uitzicht op de fjorden.', 'Åndalsnes+Noorwegen', notavailable, '8', '75','camping_norway.jpg', callback);
        },
        function(callback) {
          vacationhouseCreate('Villa France', 'Zeer moderne en volledig uitgeruste villa dicht bij het centrum van Parijs. Het zwembad biedt de perfecte afkoeling na een lange dag van excursies. Huisdieren zijn niet toegelaten.', 'Saint-Denis+Frankrijk', notavailable, '5', '256','villa_france.jpg', callback);
        },
        function(callback) {
          vacationhouseCreate('Residentie Marseille', 'Deze prachtige residentie is dicht gelegen bij Marseille. Geschikt voor kleine kinderen, kinderzwembad is aanwezig. De gastvrije buren zullen u graag enkele unieke toeristische plekjes tonen.', 'Cassis+Frankrijk', notavailable, '8', '290','france_hous2.jpg', callback);
        },
        function(callback) {
          vacationhouseCreate('Appartement Thailand', 'Een klein maar gezellig appartementje voor 2 gelegen in Bankok. Een perfecte uitvalsbasis voor het verkennen van Thailand. Ontbijt en avondeten zijn inbegrepen in de prijs.', 'Bang+Khun+Thian+Bangkok+Thailand', notavailable, '2', '100','appartement_bankok.jpg', callback);
        },
        function(callback) {
          vacationhouseCreate('Tropical villa', 'Dit tropisch huis is perfect om je volledig te ontspannen. Alle faciliteiten zijn aanwezig samen met een klein en gezellig winkeltje op 15 minuten stappen.', 'Changwat+Samut+Songkhram+Thailand', notavailable, '5', '89','thailand_hous2.jpg', callback);
        },
        function(callback) {
          vacationhouseCreate('Motel USA', 'Met een laag budget moet je in dit gezellig motel zijn! Het motel is ideaal gelegen wanneer je een rondtrip hebt gepland. Gratis wifi is en bedlinnen zijn aanwezig.', 'Long+Island+New+York+Verenigde+Staten', notavailable, '4', '50','motel_usa.jpg', callback);
        },
        function(callback) {
          vacationhouseCreate('BNB Barcelona', 'Geniet van de mooie architectuur van Barcelona vanuit je BNB. Ontbijt inbegrepen, lunch pakket op aanvraag.', 'Cornellà+de+Llobregat+Spanje', notavailable, '2', '220','bnb_barcelona.jpg', callback);
        }
        ],
        // optional callback
        cb);
}


function createCitys(cb) {
    async.parallel([
        function(callback) {
          cityCreate('Geiranger', 'Geiranger+Noorwegen', 'Geiranger is een dorpje dat behoort bij de gemeente Stranda in Noorwegen. Het dorpje ligt aan het prachtige Geirangerfjord, die sinds 2005 op de werelderfgoedlijst van UNESCO staat. In de zomer wordt het dorp bezocht door ongeveer 180 cruise schepen. Elk jaar komen 700.000 toeristen naar Geiranger.', vacationhouses[2], ['geiranger_norway.jpg'], callback);
        },
        function(callback) {
          cityCreate('Åndalsnes', 'Åndalsnes+Noorwegen', 'Åndalsnes is een kleine stad in de gemeente Rauma van Noorwegen. Åndalsnes is een perfecte uitvalsbasis voor het bezoeken van de bekende Trollstigen Road.', vacationhouses[3], ['andalsnes.jpg'], callback);
        },
        function(callback) {
          cityCreate('Rome', 'Rome+Italië', 'Rome is de hoofdstad van Italië. De stad heeft een grote geschiedenis met allerlei bezienswaardigheden waaronder het Colosseum, het Pantheon, het Forum Romanum, de Sint-Pietersbasiliek en de Trevifontein.', vacationhouses[0], ['italy_rome.jpg'], callback);
        },
        function(callback) {
          cityCreate('Napels', 'Napels+Italië', 'Napels is een havenstad. Napels heeft een rijke geschiedenis, kunst en cultuur en een wereldberoemde gastronomie. Perfect dus om te bezoeken!', vacationhouses[1], ['napels.jpg'], callback);
        },
        function(callback) {
          cityCreate('Parijs', 'Parijs+Frankrijk', 'Parijs is de hoofdstad van Frankrijk. Door de rijke cultuur, geschiedenis en gastronomie is de stad een populaire toeristische trekpleister.', vacationhouses[4], ['france_paris.jpg'], callback);
        },
        function(callback) {
          cityCreate('Marseille', 'Marseille+Frankrijk', 'Marseille is de grootste handelshaven van Frankrijk. De stad ligt aan de Middellandse Zee en heeft een rijke geschiedenis.', vacationhouses[5], ['marseille.jpg'], callback);
        },
        function(callback) {
          cityCreate('Bangkok', 'Bangkok+Thailand', 'Bangkok is de grootste stad van Thailand tevens is het de hoofdstad. Het is een multiculturele metropolis, oud en nieuw treffen hier elkaar.', [vacationhouses[6],vacationhouses[7]], ['thailand_bankok.jpg'], callback);
        },
        function(callback) {
          cityCreate('New York', 'New+York+Verenigde+Staten', 'New York! De stad die je moet gezien hebben, bruisend van het leven, een mengelmoes van cultuur en waar het licht nooit uitgaat. Kom hier alle culturen ontmoeten om je vakantie een fantastische start te geven!', vacationhouses[8], ['USA_NewYork.jpeg'], callback);
        },
        function(callback) {
          cityCreate('Barcelona', 'Barcelona+Spanje', 'Barcelona is de op één na grootste stad van Spanje. De stad heeft een rijke cultuur en geschiedenis. Je kunt er genieten van heerlijke plaatselijke gerechten. Negen bouwwerken staan op de Werelderfgoedlijst van de UNESCO, waardoor deze stad zeker een aanrader is om te bezoeken.', vacationhouses[9], ['spain_barcelona.jpg'], callback);
        }
        ],
        // optional callback
        cb);
}


function createCountries(cb) {
    async.parallel([
        function(callback) {
          countryCreate('Noorwegen', 'Noorwegen', ['norway_banner.jpg','norway_icon.png'], 'rtD6JzJvtfs', 'Door de schitterende fjorden langs de kust en de torenhoge bergen zou Noorwegen wel eens een van de mooiste landen ter wereld genoemd mogen worden. Je mag wild kamperen in de volle natuur, dit maakt Noorwegen een avontuurlijke bestemming.', [cities[0],cities[1]], callback)
        },
        function(callback) {
          countryCreate('Italië', 'Italië', ['italy_banner.jpg','italy_icon.png'], 'FlRwssZYRM0', 'Van de besneeuwde toppen van de Alpen tot de blauwe Middellandse Zee: de schoonheid van Italië is ongeëvenaard. Je kunt er bijvoorbeeld voor kiezen om na een heerlijk bord pasta het Colosseum te bezoeken of om, nadat je genoten hebt van de lokale Sangiovese, ontspannen over een kanaal te varen. Ontdek de Toscaanse wijngaarden en olijfbomen of haal je hart op bij boetieken in de modestad Milaan. Vanaf de kliffen van Sorrento kun je speuren naar zeemeerminnen of genieten van de beroemde kaas en ham uit Parma. Wat je ook kiest, het land zal je fascineren.', [cities[2],cities[3]], callback)
        },
        function(callback) {
          countryCreate('Frankrijk', 'Frankrijk', ['france_banner.jpg','france_icon.png'], 'zTjnQ0XlAc4', 'Frankrijk is meer dan alleen Parijs: van de sprookjesachtige kastelen in het Loiredal, de lavendelvelden in de Provence tot de door vele beroemdheden bezochte stranden aan de Franse Rivièra. De wereldberoemde gastronomie en de kwaliteitswijnen vormen de perfecte aanvulling op de bergen en architectonische meesterwerken van het land.', [cities[4],cities[5]], callback)
        },
        function(callback) {
          countryCreate('Thailand', 'Thailand', ['thailand_banner.jpg', 'thailand_icon.png'], 'bXMEAsBDlBg', 'De weelderige jungles van Thailand staan garant voor avontuur, terwijl de serene stranden de perfecte plaats zijn om heerlijk van de zon te genieten. De Similan Islands zijn een van de beste duiklocaties ter wereld, waar barracuda’s tussen de koraalriffen en rotsformaties zwemmen. Feest mee in de nachtclubs van Patong of geniet van de overheerlijke plakrijst met mango bij het beroemde familierestaurant Kao Neoo Korpanich in Bangkok. De stad Chiang Mai is echte must-see: een mozaïek van eeuwenoude tempels, massagesalons, muziekpodia, en markten.', [cities[8]], callback)
        },
        function(callback) {
          countryCreate('USA','Verenigde Staten', ['USA_banner.jpg','USA_icon.png'], 'b7FNvq11CEw', 'Als je in een vakantie veel unieke ervaringen op wilt doen, dan is Californië de place to be. In Zuid-Californië kun je surfen op de legendarische stranden of in een cabrio over de Pacific Coast Highway rijden terwijl je meezingt met de Beach Boys. Filmliefhebbers moeten de Hollywood-letters met eigen ogen zien en wijnkenners wanen zich in het paradijs in Napa en Sonoma Valley. Wandel langs de eeuwenoude hoge bomen in het Sequoia National Park. Of verwen je innerlijke fijnproever in San Francisco, waar enkele van de beste restaurants van de Verenigde Staten te vinden zijn.', [cities[7]], callback)
        },
        function(callback) {
          countryCreate('Spanje', 'Spanje', ['spain_banner.jpg','spain_icon.png'], '9ru-VO0j0xE', 'Spanje is geografisch gezien zeer divers; van de zonovergoten eilandengroepen, de bruisende steden en de besneeuwde bergtoppen tot semi-aride woestijnen. Het enorme land waar de Atlantische Oceaan en de Middellandse Zee samenkomen heeft niet alleen een van de meest indrukwekkende landschappen van Europa, maar ook een van de beste keukens.', [cities[6]], callback)
        }
        ],
        // Optional callback
        cb);
}



async.series([
    createVacationhouses,
    createCitys,
    createCountries
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Country: '+countries);

    }
    // All done, disconnect from database
    mongoose.connection.close();
});
