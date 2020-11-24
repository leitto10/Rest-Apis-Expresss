const mongoose = require('mongoose');

const quotesSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    quote: String,
    author: String,
    date: String
});

module.exports = mongoose.model('Quotes', quotesSchema);