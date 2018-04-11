//console.log('Hello from scraper.js');
var cheerio = require('cheerio'); // Basically jQuery for node.js
var rp = require('request-promise');
var db = require('./db');

var petrolPrice = [];
var dieselPrice = [];
var priceList = [];

var petrolDone = false;
var dieselDone = false;

var resp;

exports.scrapePrices = function (res) {

    resp = res;
    scrapePetrolPrice();
    scrapeDieselPrice();
    // while (petrolPrice.length == 0 || dieselPrice.length == 0){
    //
    // }
    //mergeLists();
    //res.send(priceList);
}

function storeList(){
    //Call db and store the list

    db.storePriceList(priceList);
    resp.send("Done db operation");
}

function checkComplete() {
    if(petrolDone && dieselDone) {
        petrolDone = false;
        dieselDone = false;
        mergeLists();
        // res.send(priceList);
    }
}

function mergeLists() {

    var i,j;
    for(i=0; i<petrolPrice.length; i++){
        var temp = petrolPrice[i];
        for(j=0; j<temp.prices.length; j++){
            if(temp.prices[j].city === dieselPrice[i].prices[j].city)
            temp.prices[j]['diesel'] = dieselPrice[i].prices[j].diesel;

            console.log(temp.prices[j].city+" "+temp.prices[j].petrol+" "+temp.prices[j].diesel);
        }
        priceList.push(temp);
    }

    console.log("Done merging");
    //resp.send(priceList);

    storeList();

}

function scrapeDieselPrice() {
    // var cheerio = require('cheerio'); // Basically jQuery for node.js
    // var rp = require('request-promise');

    var options = {
        uri: 'https://www.mypetrolprice.com/diesel-price-in-india.aspx',
        transform: function (body) {
            return cheerio.load(body);
        }
    };



    rp(options)
        .then(function ($) {
            var temp = $('.container.row ').eq(8).children();
            temp.each(function (i, elem) {
                if(!$(this).hasClass('clearBoth'))
                {
                    var cityPrice = [];
                    var title = $(this).find('h2').text();
                    $(this).find('#mainDiv').each(function (i, elem) {
                        var city = $(this).find('div:first-child a').text().trim();
                        var price = $(this).find('b.fnt18').text().trim().slice(2);

                        var tempObj = {
                            'city': city,
                            'diesel': price
                        }

                        //console.log('city '+city+' price'+price);
                        cityPrice.push(tempObj);
                    })

                    var tempState = {
                        'state': title,
                        'prices': cityPrice
                    }
                    dieselPrice.push(tempState);
                }
            })
            //console.log(result);
            //console.log(petrolPrice);
            //res.send(petrolPrice);
            console.log("Done fetching diesel");
            dieselDone = true;

            checkComplete();
        })
        .catch(function (err) {
            console.log("Unable to fetch webpage"+err);
        });
}

function scrapePetrolPrice() {
    // var cheerio = require('cheerio'); // Basically jQuery for node.js
    // var rp = require('request-promise');

    var options = {
        uri: 'https://www.mypetrolprice.com/petrol-price-in-india.aspx',
        transform: function (body) {
            return cheerio.load(body);
        }
    };



    rp(options)
        .then(function ($) {
            var temp = $('.container.row ').eq(8).children();
            temp.each(function (i, elem) {
                if(!$(this).hasClass('clearBoth'))
                {
                    var cityPrice = [];
                    var title = $(this).find('h2').text();
                    $(this).find('#mainDiv').each(function (i, elem) {
                        var city = $(this).find('div:first-child a').text().trim();
                        var price = $(this).find('b.fnt18').text().trim().slice(2);

                        var tempObj = {
                            'city': city,
                            'petrol': price
                        }

                        //console.log('city '+city+' price'+price);
                        cityPrice.push(tempObj);
                    })

                    var tempState = {
                        'state': title,
                        'prices': cityPrice
                    }
                    petrolPrice.push(tempState);
                }
            })
            //console.log(result);
            //console.log(petrolPrice);
            //res.send(petrolPrice);
            console.log("Done fetching petrol");
            petrolDone = true;

            checkComplete();
        })
        .catch(function (err) {
            console.log("Unable to fetch webpage"+err);
        });
}