// app/models/crumb.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

//Here we define our database schema
var CrumbSchema   = new Schema({
    name: String,
    course: String,
    img: { path: String, contentType: String }
});

module.exports = mongoose.model('Crumb', CrumbSchema);
