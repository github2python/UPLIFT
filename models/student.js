const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    name: String,
    familyincome: Number,
    reward: Number,
    percentage: Number,
    standard:String,
    website:String
});

module.exports = mongoose.model('Student', StudentSchema);
