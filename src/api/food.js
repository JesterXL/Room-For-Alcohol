console.log('Loading restify server...');

var _       = require('lodash');
var Promise = require("bluebird");
var restify = require('restify');
var foodCollection = require('./foodCollection');
var api     = restify.createServer({name: 'room-for-alcohol-api'});

api.listen(2146, function () {
    console.log('%s listening at %s', api.name, api.url)
});

api.pre(restify.CORS({
    origins: ['*'],
    credentials: false,
    headers: ['X-Requested-With', 'Authorization']
}));
api.pre(restify.fullResponse());

api.use(restify.bodyParser());

api.get('/ping', function (req, res, next) {
    console.log("ping called");
    res.send(200, {response: true});
});
api.get('/api/version', function(req, res, next) {
   res.send(200,{version:'0.8675309asdf'})
});
api.get('/api/calories', function(req, res, next)
{

    console.log("api::calories");
    res.send(200, {
        macros: [
            {
                days: [0, 2, 4, 6],
                protein: 0.45,
                carbs: 0.08,
                fat: 0.42,
                adjustment: 0.35,
                goal: 2000,
                food: 0,
                exercise: 300,
                proteinCurrent: 0,
                fatCurrent: 0,
                carbsCurrent: 0,
                foods: []

            },

            {
                days: [1, 3, 5],
                protein: 0.32,
                carbs: 0.48,
                fat: 0.2,
                adjustment: 0,
                goal: 1650,
                food: 0,
                exercise: 300,
                proteinCurrent: 0,
                fatCurrent: 0,
                carbsCurrent: 0,
                foods: []
            }
        ]

    });
});

api.get('/api/workouts', function(req, res, next)
{
    res.send(200, [
        {
            days: [1, 3, 5],
            notes: null,
            exercises: [
                {
                    name: 'Squat',
                    sets: [
                        {
                            reps: 5,
                            weight: 295,
                            actualReps: 5
                        },
                        {
                            reps: 5,
                            weight: 295,
                            actualReps: 5
                        },
                        {
                            reps: 5,
                            weight: 295,
                            actualReps: 5
                        }
                    ]
                },

                {
                    name: 'Bench Press',
                    sets: [
                        {
                            reps: 5,
                            weight: 180,
                            actualReps: 5
                        },
                        {
                            reps: 5,
                            weight: 180,
                            actualReps: 5
                        }
                    ]
                },

                {
                    name: 'Deadlift',
                    sets: [
                        {
                            reps: 5,
                            weight: 315,
                            actualReps: 5
                        }
                    ]
                }
            ]
        },
        
        {
            days: [0, 2, 4, 6],
            notes: null,
            exercises: []
        }
    ]);
});

api.get('/api/foods', function(req, res, next)
{
    console.log("api::foods");
    var foods = require('./foods.json');
    var len = foods.length;
    var newFoods = [];
    for(var i=0; i<len; i++)
    {
        var oldFood = foods[i];
        var newFood = {
            name: oldFood.description,
            amount: 1,
            portions: oldFood.portions,
            protein: _.find(oldFood.nutrients, function(nutrient)
            {
                return nutrient.description == "Protein";
            }).value,

            carbs: _.find(oldFood.nutrients, function(nutrient)
            {
                return nutrient.description == "Carbohydrate, by difference";
            }).value,

            fat: _.find(oldFood.nutrients, function(nutrient)
            {
                return nutrient.description == "Total lipid (fat)";
            }).value
        };

        if(newFood.name.length > 42)
        {
            newFood.shortName = oldFood.description.substr(0, 42) + "...";
        }
        else
        {
            newFood.shortName = newFood.name;
        }
        newFood.calories = (newFood.protein * 4) + (newFood.carbs * 4) + (newFood.fat * 9);
        newFoods.push(newFood);
    }

    res.send(200, newFoods);
});




try
{
    return;
    var MongoClient = require('mongodb').MongoClient
      , assert = require('assert');
     
    // Connection URL 
    var url = 'mongodb://localhost:27017/mydb';
    // Use connect method to connect to the Server 
    MongoClient.connect(url, function(err, db) {
        console.log("MongoClient connect");
      assert.equal(null, err);
      console.log("Connected correctly to server");
     
     insertDocuments(db, function() {
        updateDocument(db, function() {
          removeDocument(db, function() {
            findDocuments(db, function() {
              db.close();
            });
          });
        });
      });
    });

    var insertDocuments = function(db, callback) {
      // Get the documents collection 
      var collection = db.collection('documents');
      // Insert some documents 
      collection.insert([
        {a : 1}, {a : 2}, {a : 3}
      ], function(err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the document collection");
        callback(result);
      });
    };

    var updateDocument = function(db, callback) {
      // Get the documents collection 
      var collection = db.collection('documents');
      // Update document where a is 2, set b equal to 1 
      collection.update({ a : 2 }
        , { $set: { b : 1 } }, function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Updated the document with the field a equal to 2");
        callback(result);
      });  
    };

    var removeDocument = function(db, callback) {
      // Get the documents collection 
      var collection = db.collection('documents');
      // Insert some documents 
      collection.remove({ a : 3 }, function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Removed the document with the field a equal to 3");
        callback(result);
      });    
    };

    var findDocuments = function(db, callback) {
      // Get the documents collection 
      var collection = db.collection('documents');
      // Find some documents 
      collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        assert.equal(2, docs.length);
        console.log("Found the following records");
        console.dir(docs)
        callback(docs);
      });      
    };


}
catch(e)
{
    console.error("Failed to boot up Mongo in Restify API.");
    console.error(e);
}

module.exports = api;