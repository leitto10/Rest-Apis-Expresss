
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors());
app.use(express.json());
// set Access-Control-Allow-Origin header for api route
app.use('/api', require('cors')());

//Connection string to the database
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('DB Connected!'))
.catch(err => {
    console.log(err);
});

const records = require('./models/quotes');

// https://rest-apis-expresss.herokuapp.com/api/quotes
app.get('/api/v1/quotes', (req, res, next) => {
    return records.find({})
    .lean()
    .then((quotes) => {
        console.log(quotes);
        res.json(quotes);
    })
    .catch(err => next(err));
});

// https://rest-apis-expresss.herokuapp.com/api/detail?id=
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

// Send a POST request to CREATE new Document.
// https://rest-apis-expresss.herokuapp.com/api/quotes
app.post('/api/v1/quotes', (req, res) => {
    console.log('Body', req.body);
    if(req.body.author && req.body.quote && req.body.date){
        const quote = new records({
            _id: new mongoose.Types.ObjectId(),
            quote: req.body.quote,
            author: req.body.author,
            date: req.body.date
        })
        quote.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "New Document Created...",
                createdDoc: quote
            });
        })
        .catch(err => console.log(err));
    }else{
        res.status(404).json({message: "Quote and author required."});
    }
});

// Delete a Quote from the database
// https://rest-apis-expresss.herokuapp.com/api/delete/:id
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

//Update a sigle record
// https://rest-apis-expresss.herokuapp.com/api/quote/:id
app.post('/api/v1/quote/:id', (req, res) => {
    const itemId = req.params.id;
    if(!itemId){
        return req.status(400).send("Missing URL parameter: quote id.");
    }
    records.findByIdAndUpdate(
        {_id: itemId}, req.body, {new: true}
    )
    .exec()
    .then(result => {
        console.log(result);
        res.json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

//Error handlers middleware for staff that wen wrong with the 
//request or the server.
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


app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
  