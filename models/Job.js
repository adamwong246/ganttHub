var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JobSchema = new Schema({
    status: Number, 
    timestamp: Date,
    filepath: String,
    iterations: Number,
    label: String
});

module.exports = mongoose.model('Job', JobSchema);