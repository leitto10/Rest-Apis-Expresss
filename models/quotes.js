const mongoose = require('mongoose');

//Connection string to the database
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('DB Connected!'))
.catch(err => {
    console.log(err);
})

const quotesSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    quote: String,
    author: String,
    date: String
});

module.exports = mongoose.model('Quotes', quotesSchema);