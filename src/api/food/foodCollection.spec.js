var should = require('chai').should();
var expect = require('chai').expect;
var foodCollection = require('./foodCollection');
var Client = require('../mongo/client');
var Promise = require('bluebird');

describe('Food API', function()
{

  var client, db;

  before(function(done)
  {
    client = new Client();
    client.connect()
    .then(function()
    {
      console.log("Connected correctly to server");
      db = client.db;
      foodCollection.db = db;
      return foodCollection.removeAll();
    })
    .then(function()
    {
      done();
    })
    .error(function(err)
    {
      done(err);
    })
  });

  after(function(done)
  {
    foodCollection.removeAll()
    .then(function()
    {
      return client.close();
    })
    .then(function()
    {
      client = null;
      done();
    })
    .error(function(err)
    {
      client = null;
      done(err);
    });
  });

  beforeEach(function(done)
  {
    foodCollection.removeAll()
    .then(function()
    {
      done();
    })
    .error(function(err)
    {
      done(err);
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

});


