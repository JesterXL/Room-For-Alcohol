console.log('Loading express server...');

var path = require('path');
var pkg = require(path.resolve('./package.json'));
var express = require('express');
var favicon = require('serve-favicon');
var api = require('../api/api'); // Runs restify api in tandem
var app = express();


app.use('/', express.static('./build/'));

// app.use(express.static('build/images'));

app.use('/bower_components',  express.static('bower_components'));
app.use('/node_modules',  express.static('node_modules'));
app.use('/build', express.static('build'));
app.use(favicon(__dirname + '/favicon.ico'));

app.get('/', function(req, res)
{
	console.log("app::get/");
	//res.send('Default Express server response. Perhaps you should run grunt serve --dev or --build');
	res.sendFile('/build/index.html');
});

//As a fallback, any route that would otherwise throw a 404 (Not Found) will be given to the
//home page, which will try to decompose the route and use the correct client-side route.
app.use(function(req, res, next)
{
	console.log("app::use fallback");
    console.log('Falling back to build/index.html instead of ' + req.url);
    req.url = 'build/index.html';
    // next();
});


var port = 8628;
app.listen(port, function()
{
    console.log('Demo server started on port ' + port);
});

// var express = require('express')
// var app = express()

// app.get('/', function (req, res) {
//   res.send('Hello World!')
// })

// var server = app.listen(3000, function () {

//   var host = server.address().address
//   var port = server.address().port

//   console.log('Example app listening at http://%s:%s', host, port)

// })