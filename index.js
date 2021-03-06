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

var mongoDB = process.env.MONGOLAB_URI || 'mongodb://localhost/test';
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/start', function (req, res) {
    clearStateDB()
    var petrolPrices = scraper.scrapePrices(res);
    //console.log(petrolPrices)
    //res.send(petrolPrices);
})

app.get('/clear', function (req, res) {
    clearStateDB()
})


app.get('/fetch/:stateName', function (req, res) {
    var prices = appdb.fetchStatePrice(req.params.stateName.toLowerCase(), res);
})

var job = new CronJob({
    cronTime: '00 12 23 * * *',
    onTick: function() {

        clearStateDB()
        setScraper();
    },
    start: false,
    timeZone: 'Asia/Kolkata'
});

function setScraper(){
    console.log("Scheduler starting");
    scraper.scrapePrices();
}

function clearStateDB() {
    appdb.clearDB()
}

console.log('job status', job.running);
if(!job.running)
    job.start();
console.log('job status', job.running);

var DateModel = require('./app/models/datemodel')
var curDate = new Date();
DateModel.find({date: curDate.toDateString()}, function (err, docs) {
    if(docs.length){
        console.log("Already scraped today!!")
    }
    else {
        console.log("Scheduling scraping");
        clearStateDB()
        setScraper();
    }

    if(err){
        console.log("Error in fetching date: "+err);
    }
})

app.listen(PORT, function(){ console.log('Example app listening on port '+ PORT) })