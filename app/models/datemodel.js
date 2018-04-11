var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var dateSchema = mongoose.Schema({
    date: String
})

module.exports = mongoose.model('DateModel', dateSchema)