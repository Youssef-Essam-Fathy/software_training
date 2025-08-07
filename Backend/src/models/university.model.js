const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
    Index: Number,
    '2026 Rank': Number,
    '2025 Rank': Number,
    Name: String,
    Country: String,
    Region: String,
    Size: String,
    Focus: String,
    Research: String,
    Status: String,
    'AR SCORE': Number,
    'AR RANK': mongoose.Schema.Types.Mixed,
    'ER SCORE': Number,
    'ER RANK': mongoose.Schema.Types.Mixed,
    'FSR SCORE': Number,
    'FSR RANK': mongoose.Schema.Types.Mixed,
    'CPF SCORE': Number,
    'CPF RANK': mongoose.Schema.Types.Mixed,
    'IFR SCORE': Number,
    'IFR RANK': mongoose.Schema.Types.Mixed,
    'ISR SCORE': Number,
    'ISR RANK': mongoose.Schema.Types.Mixed,
    'ISD SCORE': Number,
    'ISD RANK': mongoose.Schema.Types.Mixed,
    'IRN SCORE': Number,
    'IRN RANK': mongoose.Schema.Types.Mixed,
    'EO SCORE': Number,
    'EO RANK': mongoose.Schema.Types.Mixed,
    'SUS SCORE': Number,
    'SUS RANK': mongoose.Schema.Types.Mixed,
    'Overall SCORE': Number,
});

const University = mongoose.model('University', universitySchema, 'egypt');
module.exports = University;
