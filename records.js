const fs = require('fs');
const records1 = require('./records');

/**
 * Gets all quotes
 * @param None
 */
function getQuotes(){
    return new Promise((resolve, reject)=> {
        fs.readFile('data.json', 'utf8', (err, data)=> {
            if(err){
                reject(err);
            }else{
                const json = JSON.parse(data);
                resolve(json);
            }
        })
    })
}

/**
 * Gets a specific quote by ID
 * @param {number} id - Accepts the ID of the specified quote.
 */
async function getQuote(id) {
    const quotes = await getQuotes();
    return quotes.records.find(record => record.id == id);
}

module.exports = {
  getQuotes,
  getQuote
}