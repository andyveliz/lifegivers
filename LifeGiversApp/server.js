var express 	= require('express'),
	app 		= express(),
	bodyParser 	= require('body-parser'),
	path		= require('path'),
	http 		= require('http'),
	server 		= http.createServer(app),
	io 			= require('socket.io').listen(server),
	mongoose    = require('mongoose'),
	donors 		= require('./server/donors');

//Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/lifegivers');

//Set bodyparser to receive JSON
app.use(bodyParser.json());

//Main
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'client', 'views', 'index.html'));
});

//REST api
app.use('/api/', donors);

//Server Startup
app.listen(3000, function(){
	server.listen(8000, function(){
		console.log("LifeGivers server up an listening on port 3000, socket.io in port 8000");
	});
})