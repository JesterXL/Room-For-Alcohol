var should = require('chai').should();
var expect = require('chai').expect;
var foodCollection = require('./foodCollection');

describe('Food API', function()
{

  var MongoClient, db;

  before(function(done)
  {
    MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb://localhost:27017/mydb';
    // Use connect method to connect to the Server 
    MongoClient.connect(url, function(err, dbInstance)
    {
      console.log("MongoClient connect");
      if(err)
      {
        console.error("err:", err);
        done();
        return;
      }
      console.log("Connected correctly to server");
      db = dbInstance;
      foodCollection.db = db;
      foodCollection.removeAll()
      .then(function()
      {
        done();
      });
      
    });
  });

  after(function(done)
  {
    foodCollection.removeAll()
    .then(function()
    {
      db.close();
      done();
    });
  });

  beforeEach(function(done)
  {
    foodCollection.removeAll()
    .then(function()
    {
      done();
    });
  });

  it('foodAPI is there', function()
  {
    expect(foodCollection).to.exist;
  });

  it('foodAPI has a db instance', function()
  {
    expect(foodCollection.db).to.exist;
  });

  it("a Promise works", function(done)
  {
    new Promise(function(success, fail)
    {
      setTimeout(success, 100);
    })
    .then(function()
    {
      expect(true).to.be.true;
      done();
    });
  });

  it('foodAPI can add food', function(done)
  {
      foodCollection.insertFood({name: 'some food'})
      .then(function(result)
      {
        expect(result.result.ok).to.equal(1);
        done();
      });
  });

  it('foodAPI can add food and then find it', function(done)
  {
      foodCollection.insertFood({name: 'some food'})
      .then(function(result)
      {
        expect(result.result.ok).to.equal(1);
        return foodCollection.findFood({name: 'some food'});
      })
      .then(function(result)
      {
        expect(result.length).to.equal(1);
        done();
      })
      .catch(function(error)
      {
        done(error);
      });
  });

  it('foodAPI can add food, then update its name', function(done)
  {
    foodCollection.insertFood({name: 'some food'})
    .then(function(result)
    {
      expect(result.result.ok).to.equal(1);
      return foodCollection.findFood({name: 'some food'});
    })
    .then(function(result)
    {
      expect(result.length).to.equal(1);
      return foodCollection.updateFood({name: 'some food'}, {name: 'cow'});
    })
    .then(function(result)
    {
      expect(result.result.ok).to.equal(1);
      return foodCollection.findFood({name: 'cow'});
    })
    .then(function(result)
    {
      expect(result.length).to.equal(1);
      expect(result[0].name).to.equal('cow');
      done();
    })
    .catch(function(error)
    {
      done(error);
    });
  });

  it('foodAPI can add food, then update its name with multiple items in there', function(done)
  {
    foodCollection.insertFood({name: 'some food'})
    .then(function(result)
    {
      return foodCollection.insertFood({name: 'another food'});
    })
    .then(function(result)
    {
      return foodCollection.insertFood({name: 'dog food man'});
    })
    .then(function(result)
    {
      return foodCollection.findFood({name: 'some food'});
    })
    .then(function(result)
    {
      expect(result.length).to.equal(1);
      return foodCollection.updateFood({name: 'some food'}, {name: 'cow'});
    })
    .then(function(result)
    {
      expect(result.result.ok).to.equal(1);
       return foodCollection.findFood({name: 'cow'});
    })
    .then(function(result)
    {
      expect(result.length).to.equal(1);
      expect(result[0].name).to.equal('cow');
      done();
    })
    .catch(function(error)
    {
      done(error);
    });
  });

  it('foodAPI can add food, then update its name with multiple items of the same name in there', function(done)
  {
    foodCollection.insertFood({name: 'some food'})
    .then(function(result)
    {
      return foodCollection.insertFood({name: 'some food'});
    })
    .then(function(result)
    {
      return foodCollection.insertFood({name: 'some food'});
    })
    .then(function(result)
    {
      return foodCollection.findFood({name: 'some food'});
    })
    .then(function(result)
    {
      expect(result.length).to.equal(3);
      return foodCollection.updateFood({name: 'some food'}, {name: 'cow'});
    })
    .then(function(result)
    {
      expect(result.result.ok).to.equal(1);
      return foodCollection.findFood({name: 'cow'});
    })
    .then(function(result)
    {
      expect(result[0].name).to.equal('cow');
      done();
    })
    .catch(function(error)
    {
      done(error);
    });
  });

  it('foodAPI can add food and then cannot find it', function(done)
  {
      foodCollection.insertFood({name: 'some food'})
      .then(function(result)
      {
        expect(result.result.ok).to.equal(1);
        return foodCollection.findFood({name: 'some food'});
      })
      .then(function(result)
      {
        expect(result.length).to.equal(1);
        return foodCollection.removeFood({name: 'some food'});
      })
      .then(function(result)
      {
        expect(result.result.ok).to.equal(1);
        return foodCollection.findFood({name: 'some food'});
      })
      .then(function(result)
      {
        expect(result.length).to.equal(0);
        done();
      })
      .catch(function(error)
      {
        done(error);
      });
  });

  it('foodAPI can add food and then cannot find it if you use wrong filter', function(done)
  {
      foodCollection.insertFood({name: 'some food'})
      .then(function(result)
      {
        expect(result.result.ok).to.equal(1);
        return foodCollection.findFood({name: 'cow'});
      })
      .then(function(result)
      {
        expect(result.length).to.equal(0);
        done();
      })
      .catch(function(error)
      {
        done(error);
      });
  });

  it('adding 3 foods results in finding 3 foods for getAllFoods via Promise', function(done)
  {
      foodCollection.insertFood({name: 'some food'})
      .then(function(result)
      {
        return foodCollection.insertFood({name: 'some food'});
      })
      .then(function(result)
      {
        return foodCollection.insertFood({name: 'some food'});
      })
      .then(function(result)
      {
        return foodCollection.getAllFoods();
      })
      .then(function(result)
      {
        expect(result.length).to.equal(3);
        done();
      })
      .catch(function(error)
      {
        done(error);
      });
  });

  it('adding 3 foods results in finding 3 foods for getAllFoods', function(done)
  {
      foodCollection.insertFood([{name: 'some food'}, {name: 'some food'}, {name: 'some food'}])
      .then(function(result)
      {
        return foodCollection.getAllFoods();
      })
      .then(function(result)
      {
        expect(result.length).to.equal(3);
        done();
      })
      .catch(function(error)
      {
        done(error);
      });
  });

  it('can add document collections?', function()
  {
    var collection = db.collection.insert({name: 'food test collection'});
  });

});


