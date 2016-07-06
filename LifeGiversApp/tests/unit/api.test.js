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
    donors      = require('../../server/donors');

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


describe('#/api/donors', function(){

	var log = console.log;

	before(function(done){
		//require(ROOT_DIR + '/server/donors');
		done();
	});

	beforeEach(function(){

		// Done to prevent any server side console logs from the routes
  	// to appear on the console when running tests
		console.log=function(){};

	});

  it('- should GET donors', function(done){
  	request(app)
      .get('/api/donors')
      .end(function(err, res){
      	// Enable the console log to print the assertion output
      	console.log = log;
      	var data = JSON.parse(res.text);
      	expect(err).to.be.null;
				expect(data.length).to.not.be.undefined;
      	done();
      });
  });

  it('- should POST a donor and get back a response', function(done){
    var donor = {
      name: 'UNIT-TEST-USER'
    };

    request(app)
      .post('/api/donors')
      .send(donor)
      .end(function(err, res){
        // Enable the console log
        console.log = log;
        var data = JSON.parse(res.text);
        expect(err).to.be.null;
        expect(data.name).to.equal(donor.name);
        done();
      });
  });

  it('- should GET a donor by name', function(done){
  	request(app)
      .get('/api/donors/by-name/UNIT-TEST-USER')
      .end(function(err, res){
      	// Enable the console log
      	console.log = log;
      	var data = JSON.parse(res.text);
      	expect(err).to.be.null;
				expect(data.name).to.equal('UNIT-TEST-USER');
      	done();
      });
  });

  it('- should PUT a donor (update)', function(done){
    request(app)
      .get('/api/donors/by-name/UNIT-TEST-USER')
      .end(function(err, res){
        // Enable the console log
        console.log = log;
        var data = JSON.parse(res.text);
        expect(err).to.be.null;
        expect(data.name).to.equal('UNIT-TEST-USER');
        request(app)
          .put('/api/donors/'+data._id)
          .send({name: 'UNIT-TEST-USER-UPDATED'})
          .end(function(err, res){
            var data = JSON.parse(res.text);
            expect(err).to.be.null;
            expect(data.name).to.equal('UNIT-TEST-USER-UPDATED');
            done();
          });
      });
  });

  it('- should DELETE a donor', function(done){
    request(app)
      .get('/api/donors/by-name/UNIT-TEST-USER-UPDATED')
      .end(function(err, res){
        // Enable the console log
        console.log = log;
        var data = JSON.parse(res.text);
        expect(err).to.be.null;
        expect(data.name).to.equal('UNIT-TEST-USER-UPDATED');
        request(app)
          .delete('/api/donors/'+data._id)
          .end(function(err, res){
            var data = JSON.parse(res.text);
            expect(err).to.be.null;
            expect(data.status).to.equal('OK');
            done();
          });
      });
  });

});