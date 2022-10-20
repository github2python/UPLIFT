const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
    name:String,
    standard:String,
    skills:String,
    organization:String,
    salary:Number
})
module.exports = mongoose.model('Job', JobSchema);
