// app/models/crumb.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CrumbSchema   = new Schema({
    name: String,
    course: String,
    img: { path: String, contentType: String }
});

module.exports = mongoose.model('Crumb', CrumbSchema);
