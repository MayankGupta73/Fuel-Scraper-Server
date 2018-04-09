var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var StateModelSchema = new Schema({
    state : String,
    prices : [{ city: String, petrol : String, diesel : String}]
});

//Export function to create  model class
module.exports = mongoose.model('StateModel', StateModelSchema );