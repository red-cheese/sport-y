var express = require('express');


// Configuration

var app = express();
app.use(express.favicon(__dirname + '/favicon.ico'));
app.use(express.bodyParser());
app.use(express.methodOverride());
// Render html pages
app.set('view options', { layout: false });
app.set('view engine', 'ejs');
app.set('views', __dirname + '/');
// Serve static files
app.use(express.static(__dirname + '/public'));


// Routes

app.get('/', function(req, res) {
	res.render('index.ejs');
    });


var port = process.env.PORT || 8080;
app.listen(port, function() {
	console.log("Listening on " + port);
    });