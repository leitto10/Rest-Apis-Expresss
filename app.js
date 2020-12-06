
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors());
app.use(express.json());
// set Access-Control-Allow-Origin header for api route
app.use('/api', require('cors')());

// Connection string to the database
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('DB Connected!'))
.catch(err => {
    console.log(err);
});

const records = require('./models/quotes');

// https://rest-apis-expresss.herokuapp.com/api/v1/quotes
app.get('/api/v1/quotes', (req, res, next) => {
    return records.find({})
    .lean()
    .then((quotes) => {
        console.log(quotes);
        res.json(quotes);
    })
    .catch(err => next(err));
});

// https://rest-apis-expresss.herokuapp.com/api/v1/detail?id=
app.get('/api/v1/detail', (req, res) => {
    //const quote = await records.getQuote(req.params.id);
    const itemId = req.query.id;
    return records.findOne({ _id: itemId })
    .lean()
    .then(quote => {
        console.log(quote);
        if(quote) {
            //res.render('details', quote);
            res.json(quote);
        }else{
            res.status(404).json({message: "Not a valid Quote id..."});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

// https://rest-apis-expresss.herokuapp.com/api/v1/quote/
app.post('/api/v1/quotes/', (req,res, next) => {
    // find & update existing item, or add new
    console.log('Body', req.body);
    if (!req.body._id) { // insert new document
        const quote = new records({
            _id: new mongoose.Types.ObjectId(),
            quote: req.body.quote,
            author: req.body.author,
            date: req.body.date
        })
        quote.save((err,newQuote) => {
            if (err) return next(err);
            console.log(newQuote)
            res.json({updated: 0, _id: newQuote._id});
        });
    } else { // update existing document
        records.findByIdAndUpdate({ _id: req.body._id}, {quote:req.body.quote, author: req.body.author, date: req.body.date }, (err, result) => {
            if (err) return next(err);
            res.json({updated: result.nModified, _id: req.body._id});
        });
    }
});

// Delete a Quote from the database
// https://rest-apis-expresss.herokuapp.com/api/v1/delete/:id
app.get('/api/v1/delete/:id', (req, res) => {
    const itemId = req.params.id;
    records.deleteOne({_id: itemId})
    .exec()
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

// Error handlers middleware for staff that wen wrong with the 
// request or the server.
app.use((req, res, next) => {
    const err = new Error("Wrong end point or request.");
    err.status = 404;
    next(err);
})

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error:{
            message: err.message
        }
    });
    next(err);
});


app.listen(process.env.PORT || 8000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
  