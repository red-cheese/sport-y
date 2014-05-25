var express = require('express');
var mongodb = require('mongodb');

var MSK_LAT = 55.75;
var MSK_LNG = 37.6167;

var CATEGORIES = [ 'Ледовые поля (крытые)', 'Лыжные базы', 'Площадки для кёрлинга', 'Площадки для сноуборда', 'Площадки спортивные универсальные в парках', 'Ледяные горки в парках', 'Места для зимней рыбалки в парках', 'Оборудованные места для зимнего купания в парках', 'Снежные горки в парках', 'Снежные городки', 'Трассы для снегоходов, квадроциклов, ездовых упряжек и прочего', 'Универсальные зоны отдыха в парках', 'Автодромы спортивные', 'Зоны отдыха у воды', 'Летние эстрады, сцены', 'Лодочные станции', 'Места для летнего купания', 'Парки (включая парки не подведомственные)', 'Площадки детские игровые', 'Площадки для настольных игр', 'Площадки для пикника', 'Роллердромы, скейтпарки', 'Автодромы детские учебные', 'Бассейны плавательные крытые', 'Бассейны плавательные открытые', 'Велопарковки', 'Горнолыжные склоны Москвы', 'Городки веревочные', 'Городки тренажерные (воркауты)', 'Городки тренажерные универсальные', 'Гребные базы и каналы', 'Дорожки беговые-прогулочные', 'Лыжные трассы города Москвы', 'Открытые ледовые катки города Москвы', 'Площадки для городошного спорта', 'Площадки для пляжных видов спорта', 'Площадки пейнтбольные', 'Площадки спортивные универсальные', 'Поля для гольфа', 'Поля для мини-гольфа', 'Поля конно-спортивные для конкура и выездки', 'Поля регбийные', 'Поля футбольные', 'Прокаты спортивного инвентаря (отдельностоящие)', 'Скалодромы', 'Станции проката велосипедов', 'Стрелковые тиры', 'Стрельбища', 'Теннисные корты' ];

var CATEGORIES_EN = {
    'Covered skating rinks': 'Ледовые поля (крытые)',
    'Ski resorts': 'Лыжные базы',
    'Curling': 'Площадки для кёрлинга',
    'Snowboading': 'Площадки для сноуборда',
    'Playgrounds in parks': 'Площадки спортивные универсальные в парках',
    'Slides in parks': 'Ледяные горки в парках',
    'Winter fishing in parks': 'Места для зимней рыбалки в парках',
    'Winter swimming': 'Оборудованные места для зимнего купания в парках',
    'Snow coasts in parks': 'Снежные горки в парках',
    'Snow fortresses in parks': 'Снежные городки',
    'Showmobiles': 'Трассы для снегоходов, квадроциклов, ездовых упряжек и прочего',
    'Rest areas in parks': 'Универсальные зоны отдыха в парках',
    'Motor-racing tracks': 'Автодромы спортивные',
    'Rest areas near the water': 'Зоны отдыха у воды',
    'Summer theatres': 'Летние эстрады, сцены',
    'Boat stations': 'Лодочные станции',
    'Summer swimming': 'Места для летнего купания',
    'Parks': 'Парки (включая парки не подведомственные)',
    'Playgrounds for children': 'Площадки детские игровые',
    'Playgrounds for board-games': 'Площадки для настольных игр',
    'Places for basketpicnic': 'Площадки для пикника',
    'Roller rinks': 'Роллердромы, скейтпарки',
    'Motor-racing tracks for children': 'Автодромы детские учебные',
    'Covered swimming pools': 'Бассейны плавательные крытые',
    'Outdoor swimming pools': 'Бассейны плавательные открытые',
    'Bicycle parking': 'Велопарковки',
    'Ski slopes in Moscow': 'Горнолыжные склоны Москвы',
    'Ropes courses': 'Городки веревочные',
    'Work-out playgrounds': 'Городки тренажерные (воркауты)',
    'Work-out places': 'Городки тренажерные универсальные',
    'Canoeing': 'Гребные базы и каналы',
    'Jogging paths': 'Дорожки беговые-прогулочные',
    'Ski paths in Moscow': 'Лыжные трассы города Москвы',
    'Outdoor skating rinks': 'Открытые ледовые катки города Москвы',
    'Gorodki playgrounds': 'Площадки для городошного спорта',
    'Beach sports': 'Площадки для пляжных видов спорта',
    'Paintball': 'Площадки пейнтбольные',
    'Sports playgrounds': 'Площадки спортивные универсальные',
    'Golf': 'Поля для гольфа',
    'Mini-golf': 'Поля для мини-гольфа',
    'Horse riding': 'Поля конно-спортивные для конкура и выездки',
    'Rugby': 'Поля регбийные',
    'Football': 'Поля футбольные',
    'Sports equipment renting': 'Прокаты спортивного инвентаря (отдельностоящие)',
    'Rock-climbing': 'Скалодромы',
    'Bicycle renting': 'Станции проката велосипедов',
    'Shooting saloons': 'Стрелковые тиры',
    'Shooting': 'Стрельбища',
    'Tennis': 'Теннисные корты' };


// Configuration

var MONGODB_URI = "mongodb://localhost/sporty-db", db, checkpoints;

var app = express();
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.methodOverride());
// Render html pages
app.set('view options', { layout: false });
app.set('view engine', 'ejs');
app.set('views', __dirname + '/');
// Serve static files
app.use(express.static(__dirname + '/public'));


// Routes

app.get('/sport-y/', function(req, res) {
	res.render('index.ejs', { locals: { lat: MSK_LAT, lng: MSK_LNG, toDisplay: undefined, lang: 0 } });
    });

app.get('/sport-y/en', function(req, res) {
	res.render('index.ejs', { locals: { lat: MSK_LAT, lng: MSK_LNG, toDisplay: undefined, lang: 1 } });
    });

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1); 
    var a = 
	Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
	Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    var d = R * c; // Distance in km
    return d;
}

function cmp(item1, item2) {
    if (item1["dst"] < item2["dst"]) {
	return -1;
    } else if (item1["dst"] == item2["dst"]) {
	return 0;
    }
    return 1;
}

function nearest(items, lat, lng) {
    var res = [];
    for (var i = 0; i < items.length; i++) {
	var dst = getDistanceFromLatLonInKm(lat, lng, items[i]["lat"], items[i]["lon"]);
	if (dst <= 3.0) {
	    items[i]["dst"] = dst;
	    res.push(items[i]);
	}
    }
    res.sort(cmp);
    return res;
}

function findCheckpoints(categories, lat, lng, lang, res) { // Ugly but works in the asynchronous Jaavascript nature
    if (categories.length == 0) {
	checkpoints.find().toArray(function(err, items) {
	    res.render('index.ejs', { locals: { lat: lat, lng: lng, toDisplay: JSON.stringify(nearest(items, lat, lng)), lang: lang } });
	});
    } else {
	checkpoints.find({ category: { $in: categories } }).toArray(function(err, items) {
	    res.render('index.ejs', { locals: { lat: lat, lng: lng, toDisplay: JSON.stringify(nearest(items, lat, lng)), lang: lang } });
	});
    }
}

app.post('/sport-y/', function(req, res) {
	var chosen = [];
	for (var i = 0; i < CATEGORIES.length; i++) {
	    if (req.body[CATEGORIES[i]] == '') {
		chosen.push(CATEGORIES[i]); // Very bad code, but it works fine while I've got no time for fixing
	    }
	}
	var lat = req.body.latitude || MSK_LAT;
	var lng = req.body.longitude || MSK_LNG;
	findCheckpoints(chosen, lat, lng, 0, res);
    });

app.post('/sport-y/en', function(req, res) {
	var chosen = [];
	for (var c in CATEGORIES_EN) {
	    if (CATEGORIES_EN.hasOwnProperty(c) && req.body[c] == '') {
		chosen.push(CATEGORIES_EN[c]);
	    }
	}
	var lat = req.body.latitude || MSK_LAT;
	var lng = req.body.longitude || MSK_LNG;
	findCheckpoints(chosen, lat, lng, 1, res);
    });


var port = process.env.PORT || 8080;
mongodb.MongoClient.connect(MONGODB_URI, function (err, database) {
	if (err) throw err;
	db = database;
	checkpoints = db.collection("checkpoints");
	app.listen(port, function() {
		console.log("Listening on " + port);
	});
});
