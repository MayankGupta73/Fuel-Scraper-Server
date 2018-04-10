var mongoose = require('mongoose');
var StateModel = require('./models/statemodel')

exports.storePriceList = function (priceList) {
    //Store the list in db
    var i;
    for(i=0; i<priceList.length; i++){
        saveAndUpdateList(priceList[i]);
    }
}

function saveAndUpdateList(stateList) {

    StateModel.find({state: stateList.state}, function (err, docs) {
        if(docs.length){
            console.log("Already exists "+ stateList.state);
            docs[0].prices = stateList.prices;
            stateList.state = stateList.state.toLowerCase();
        }
        else {
            console.log("Create new entry "+ stateList.state);
            stateList.state = stateList.state.toLowerCase();
            var state = new StateModel(stateList);
            state.save( function (err) {
              //  cb(err, state);
                if(err){
                    console.log("Error in database: "+err);
                }

                //console.log("Added state to db: "+stateList.state);
            });
        }
    })
}

exports.fetchStatePrice = function (stateName, res) {
    StateModel.findOne({state: stateName},{'_id':0, '__v':0}, function (err, doc) {
        console.log("Fetching "+stateName+" "+doc);

        if(err){
            console.log("Error in fetching state: "+err);
            res.send("Error occurred in fetching data: "+err);
            return;
        }

        delete doc['__v'];
        delete doc._id;

        res.send(doc);
        //return doc;
    })
}