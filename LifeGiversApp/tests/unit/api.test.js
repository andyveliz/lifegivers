var request   = require('supertest'),
    expect    = require("chai").expect;

var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    path        = require('path'),
    http        = require('http'),
    server      = http.createServer(app),
    io          = require('socket.io').listen(server),
    mongoose    = require('mongoose'),
    donorsController = require("../../server/controllers/donors");

//Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/lifegivers');

//Set bodyparser to receive JSON
app.use(bodyParser.json());

//Main
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'client', 'views', 'index.html'));
});

describe('Socket API', function(){

	var log = console.log;

	beforeEach(function(){

		// Done to prevent any server side console logs from the routes
  	// to appear on the console when running tests
		console.log=function(){};

	});

  it('- should GET donors', function(done){
  	donorsController.getInArea({from:[0,0], to:[200,200]}, function(err, data){
      	// Enable the console log to print the assertion output
      	console.log = log;
      	expect(err).to.be.null;
				expect(data.length).to.not.be.undefined;
      	done();
      });
  });

  it('- should POST a donor and get back a response', function(done){
    var donor = {
      name: 'UNIT-TEST-USER'
    };

    donorsController.create(donor, function(err, data){
        // Enable the console log
        console.log = log;
        expect(err).to.be.null;
        expect(data.name).to.equal(donor.name);
        done();
      });
  });

  it('- should GET a donor by name', function(done){
  	donorsController.getDonorByName(
      'UNIT-TEST-USER',
      function(err, data){
      	// Enable the console log
      	console.log = log;
      	expect(err).to.be.null;
				expect(data.name).to.equal('UNIT-TEST-USER');
      	done();
      });
  });

  it('- should PUT a donor (update)', function(done){
    donorsController.getDonorByName(
      'UNIT-TEST-USER',
      function(err, data){
        // Enable the console log
        console.log = log;
        expect(err).to.be.null;
        expect(data.name).to.equal('UNIT-TEST-USER');
        data.name = 'UNIT-TEST-USER-UPDATED';
        donorsController.update(
          data,
          function(err, data2){
            expect(err).to.be.null;
            expect(data2.name).to.equal('UNIT-TEST-USER-UPDATED');
            done();
          });
      });
  });

  it('- should DELETE a donor', function(done){
    donorsController.getDonorByName(
      'UNIT-TEST-USER-UPDATED',
      function(err, data){
        // Enable the console log
        console.log = log;
        expect(err).to.be.null;
        expect(data.name).to.equal('UNIT-TEST-USER-UPDATED');
        donorsController.deleteDonor(
          data._id,
          function(err){
            expect(err).to.be.null;
            done();
          });
      });
  });

});