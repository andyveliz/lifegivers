var express = require('express'),
	router = express.Router(),
	Donor = require('./models/donor');
 
//GET All Donors
router.get('/donors', function(req, res, next) {
    Donor.find({}, function (err, results) {
	    res.json(results);
	});
});

//GET Donor By Name
router.get('/donors/by-name/:name', function(req, res, next) {
    Donor.findOne({name:req.params.name}, function (err, results) {
	    res.json(results);
	});
});

//Save a Donor
router.post('/donors', function(req, res, next) {
	var donor = new Donor(req.body);
	donor.save(function (err, result) {
	    res.json(result);
	});
});

//Update a Donor
router.put('/donors/:id', function(req, res, next) {
	Donor.findByIdAndUpdate(req.params.id, { $set: req.body }, {new: true}, function (err, donor) {
	  if(err) console.log(err);
	  res.json(donor);
	});
});

//Delete a Donor
router.delete('/donors/:id', function(req, res) {
	Donor.findOneAndRemove({'_id' : req.params.id}, function(err){
		res.json({"status":"OK"});
	});
});

module.exports = router;