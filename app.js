const express = require('express');
const app = express();

app.use(express.static('public'));
//const records = require('./records');

//Send a GET request to READ(view) a list of quotes
// app.get('/quotes', async (req, res) => {
//     const quotes = await records.getQuotes();
//     res.json(quotes);  
// })

// //Send a GET request to READ(view) a single quote
// app.get('/quotes/:id', async (req, res) => {
//     const quote = await records.getQuote(req.params.id);
//     res.json(quote);
// })
//Send a POST request to CREATE a quote
//Send a PUT request to UPDATE(edit) a quote
//Send a DELETE request to DELETE a quote


//app.listen(3000, () => console.log('Quote API listening on port 3000!'));
app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
  