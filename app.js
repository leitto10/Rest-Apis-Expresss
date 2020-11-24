
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

//Connection string to the database
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('DB Connected!'))
.catch(err => {
    console.log(err);
})

//app.use(express.static('public'));

const records = require('./models/quotes');


app.get('/', (req, res, next) => {
    return records.find({})
    .lean()
    .then((quotes) => {
        console.log(quotes);
        res.json(quotes);
    })
    .catch(err => next(err));
});


//app.listen(3000, () => console.log('Quote API listening on port 3000!'));
app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
  