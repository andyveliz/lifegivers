var Donor = require('../models/donor');

module.exports = {

    //Save a Donor
    create: function(data, cb){
        delete data["_id"];
        var donor = new Donor(data);
        donor.save(cb);
    },

    //Update a Donor
    update: function(data, cb){
        Donor.findByIdAndUpdate(data._id, { $set: data }, {new: true}, cb);
    },

    donorById: function(data, cb){
        Donor.findOne({_id: data}, cb);
    },

    //Get Donors in Area
    getInArea: function(data, cb){
        Donor.find(
            {
                'lng': {$gte: data.from[0], $lte: data.to[0]},
                'lat': {$gte: data.from[1], $lte: data.to[1]},
            }, cb);
    },

    //Get Donor by Name
    getDonorByName: function(name, cb){
        Donor.findOne({name: name}, cb);
    },

    //Delete a Donor
    deleteDonor: function(id, cb){
        Donor.findOneAndRemove({'_id' : id}, cb);
    }

}