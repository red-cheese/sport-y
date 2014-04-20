var express = require('express');


// Configuration

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
	res.render('index.ejs', { locals: { lat: undefined, lng: undefined } });
    });

app.post('/', function(req, res) {
	var categories = [ 'Ледовые поля (крытые)', 'Лыжные базы', 'Площадки для кёрлинга', 'Площадки для сноуборда', 'Площадки спортивные универсальные в парках', 'Ледяные горки в парках', 'Места для зимней рыбалки в парках', 'Оборудованные места для зимнего купания в парках', 'Снежные горки в парках', 'Снежные городки', 'Трассы для снегоходов, квадроциклов, ездовых упряжек и прочего', 'Универсальные зоны отдыха в парках', 'Автодромы спортивные', 'Зоны отдыха у воды', 'Летние эстрады, сцены', 'Лодочные станции', 'Места для летнего купания', 'Парки (включая парки не подведомственные)', 'Площадки детские игровые', 'Площадки для настольных игр', 'Площадки для пикника', 'Роллердромы, скейтпарки', 'Автодромы детские учебные', 'Бассейны плавательные крытые', 'Бассейны плавательные открытые', 'Велопарковки', 'Горнолыжные склоны Москвы', 'Городки веревочные', 'Городки тренажерные (воркауты)', 'Городки тренажерные универсальные', 'Гребные базы и каналы', 'Дорожки беговые-прогулочные', 'Лыжные трассы города Москвы', 'Открытые ледовые катки города Москвы', 'Площадки для городошного спорта', 'Площадки для пляжных видов спорта', 'Площадки пейнтбольные', 'Площадки спортивные универсальные', 'Поля для гольфа', 'Поля для мини-гольфа', 'Поля конно-спортивные для конкура и выездки', 'Поля регбийные', 'Поля футбольные', 'Прокаты спортивного инвентаря (отдельностоящие)', 'Скалодромы', 'Станции проката велосипедов', 'Стрелковые тиры', 'Стрельбища', 'Теннисные корты' ];
	var chosen = [];
	for (var i = 0; i < categories.length; i++) {
	    if (req.body[categories[i]] == '') {
		chosen.push(categories[i]); // Very bad code, but it works fine while I've got no time for fixing
	    }
	}
	var lat = req.body.latitude;
	var lng = req.body.longitude;
	var toDisplay = [];
	// Query to DB


	res.render('index.ejs', { locals: { lat: lat, lng: lng, toDisplay: toDisplay } });
    });


var port = process.env.PORT || 8080;
app.listen(port, function() {
	console.log("Listening on " + port);
    });