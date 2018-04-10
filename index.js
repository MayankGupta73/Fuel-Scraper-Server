const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000

var path = require('path');
var mongoose = require('mongoose');
var CronJob = require('cron').CronJob;

var appdb = require('./app/db');

app.get('/', function(req, res){ res.send('Hello World!') })
//app.use('/public', express.static(path.join(__dirname, 'public')))

var scraper = require('./app/scraper');

var mongoDB = 'mongodb://localhost/test';
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/start', function (req, res) {
    var petrolPrices = scraper.scrapePrices();
    //console.log(petrolPrices)
    //res.send(petrolPrices);
})


app.get('/fetch/:stateName', function (req, res) {
    var prices = appdb.fetchStatePrice(req.params.stateName.toLowerCase(), res);
})

var job = new CronJob({
    cronTime: '00 12 23 * * *',
    onTick: function() {
        /*
         * Runs everyday 01:00:00 AM.
         */
        console.log("Scheduler starting");

        scraper.scrapePrices();
    },
    start: false,
    timeZone: 'Asia/Kolkata'
});

console.log('job status', job.running);
if(!job.running)
    job.start();
console.log('job status', job.running);

app.listen(PORT, function(){ console.log('Example app listening on port '+ PORT) })