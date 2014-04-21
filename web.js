var express = require('express');
var mongodb = require('mongodb');

var MSK_LAT = 55.75;
var MSK_LNG = 37.6167;

// Configuration

var MongoClient = require('mongodb').MongoClient, Server = require('mongodb').Server;
var mongoClient = new MongoClient(new Server('localhost', 27017));

var app = express();
app.use(express.favicon(__dirname + '/favicon.ico'));
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

app.get('/', function(req, res) {
	res.render('index.ejs', { locals: { lat: MSK_LAT, lng: MSK_LNG, toDisplay: undefined } });
    });

app.post('/', function(req, res) {
	var categories = [ 'Ледовые поля (крытые)', 'Лыжные базы', 'Площадки для кёрлинга', 'Площадки для сноуборда', 'Площадки спортивные универсальные в парках', 'Ледяные горки в парках', 'Места для зимней рыбалки в парках', 'Оборудованные места для зимнего купания в парках', 'Снежные горки в парках', 'Снежные городки', 'Трассы для снегоходов, квадроциклов, ездовых упряжек и прочего', 'Универсальные зоны отдыха в парках', 'Автодромы спортивные', 'Зоны отдыха у воды', 'Летние эстрады, сцены', 'Лодочные станции', 'Места для летнего купания', 'Парки (включая парки не подведомственные)', 'Площадки детские игровые', 'Площадки для настольных игр', 'Площадки для пикника', 'Роллердромы, скейтпарки', 'Автодромы детские учебные', 'Бассейны плавательные крытые', 'Бассейны плавательные открытые', 'Велопарковки', 'Горнолыжные склоны Москвы', 'Городки веревочные', 'Городки тренажерные (воркауты)', 'Городки тренажерные универсальные', 'Гребные базы и каналы', 'Дорожки беговые-прогулочные', 'Лыжные трассы города Москвы', 'Открытые ледовые катки города Москвы', 'Площадки для городошного спорта', 'Площадки для пляжных видов спорта', 'Площадки пейнтбольные', 'Площадки спортивные универсальные', 'Поля для гольфа', 'Поля для мини-гольфа', 'Поля конно-спортивные для конкура и выездки', 'Поля регбийные', 'Поля футбольные', 'Прокаты спортивного инвентаря (отдельностоящие)', 'Скалодромы', 'Станции проката велосипедов', 'Стрелковые тиры', 'Стрельбища', 'Теннисные корты' ];
	var chosen = [];
	for (var i = 0; i < categories.length; i++) {
	    if (req.body[categories[i]] == '') {
		chosen.push(categories[i]); // Very bad code, but it works fine while I've got no time for fixing
	    }
	}
	var lat = req.body.latitude || MSK_LAT;
	var lng = req.body.longitude || MSK_LNG;
	var toDisplay = [];
	// Query to DB
        mongoClient.open(function(err, mongoClient) {
	    var db = mongoClient.db("sporty-db");
	    var coll = db.collection("checkpoints");
	    if (chosen.length == 0) {
		coll.find().toArray(function(err, items) {
		    toDisplay = items;
		    mongoClient.close();
		    res.render('index.ejs', { locals: { lat: lat, lng: lng, toDisplay: JSON.stringify(toDisplay) } });
		});
	    } else {
		coll.find({ category: { $in: chosen } }).toArray(function(err, items) {
		    toDisplay = items;
		    mongoClient.close();
		    res.render('index.ejs', { locals: { lat: lat, lng: lng, toDisplay: JSON.stringify(toDisplay) } }); // Awful code, again :(
		});
	    }
	});
    });


var port = process.env.PORT || 8080;
app.listen(port, function() {
	console.log("Listening on " + port);
    });