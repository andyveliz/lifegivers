var express 	= require('express'),
	app 		= express(),
	bodyParser 	= require('body-parser'),
	path		= require('path'),
	http 		= require('http'),
	server 		= http.createServer(app),
	io 			= require('socket.io').listen(server),
	mongoose    = require('mongoose'),
	donorsController = require("./server/controllers/donors");

//Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/lifegivers');

//Set bodyparser to receive JSON
app.use(bodyParser.json());

//Main
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

//Client 
app.use('/node_modules', express.static(__dirname + '/client/node_modules/'));
app.use('/app', express.static(__dirname + '/client/app/'));
app.use('/client', express.static(__dirname + '/client/'));

//REST api
//app.use('/api/', donors);

io.on('connection', function (socket) {
	
	socket.on('saveDonor', function(donor, cb){
		donor.ip = socket.request.connection.remoteAddress;
		if(donor._id == "")
			donorsController.create(donor, cb);
		else
			donorsController.update(donor, cb);
		socket.broadcast.emit("getDonor", donor);
	});

	socket.on('donorById', function(data,cb){
		donorsController.donorById(data,cb);
	})

	socket.on('deleteDonor', function(data,cb){
		donorsController.deleteDonor(data,function(err){
			if(!err) socket.broadcast.emit("removeDonor", data);
			cb(err);
		});
	})

	socket.on('donorsInArea', function(data, cb){
		donorsController.getInArea(data, cb);
	})
});

//Server Startup
app.listen(4000, function(){
	server.listen(8000, function(){
		console.log("LifeGivers server up an listening on port 4000, socket.io in port 8000");
	});
})