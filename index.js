const express = require('express')
const app = express()
var path = require('path')

app.get('/', function(req, res){ res.send('Hello World!') })
app.use('/public', express.static(path.join(__dirname, 'public')))

var scraper = require('./public/scraper');

app.get('/petrol', function (req, res) {
    var petrolPrices = scraper.scrapePrices(res);
    //console.log(petrolPrices)
    //res.send(petrolPrices);
})

app.listen(3000, function(){ console.log('Example app listening on port 3000!') })