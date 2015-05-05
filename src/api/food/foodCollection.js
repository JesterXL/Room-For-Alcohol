
var _db = null;

var foodsCollection = {

	get db()
	{
		return _db;
	},

	set db(newDB)
	{
		_db = newDB;
	},

	insertFood: function(food)
	{
		return new Promise(function(resolve, reject)
		{
			try
			{
				var collection = _db.collection("food");
				food._dateCreated = new Date();
				collection.insert(food, function(error, result)
				{
					if(error)
					{
						reject(error);
					}
					else
					{
						resolve(result);
					}
				});
			}
			catch(err)
			{
				console.log("error:", err);
				reject(err);
			}
		});
	},

	updateFood: function(food, newFood)
	{
		return new Promise(function(resolve, reject)
		{
			var collection = _db.collection("food");
			collection.update(food, newFood, function(error, result)
			{
				if(error)
				{
					reject(error);
				}
				else
				{
					resolve(result);
				}
			});
		}); 
	},

	removeFood: function(food)
	{
		return new Promise(function(resolve, reject)
		{
			var collection = _db.collection("food");
			collection.remove(food, function(error, result)
			{
				if(error)
				{
					reject(error);
				}
				else
				{
					resolve(result);
				}
			});
		});
	},

	removeAll: function()
	{
		return new Promise(function(resolve, reject)
		{
			var collection = _db.collection("food");
			collection.remove({}, function(error, result)
			{
				if(error)
				{
					reject(error);
				}
				else
				{
					resolve(result);
				}
			});
		});
	},

	findFood: function(food)
	{
		return new Promise(function(resolve, reject)
		{
			var collection = _db.collection("food");
			collection.find(food).toArray(function(error, result)
			{
				if(error)
				{
					reject(error);
				}
				else
				{
					resolve(result);
				}
			});
		});
	},

	getAllFoods: function()
	{
		return new Promise(function(resolve, reject)
		{
			var collection = _db.collection("food");
			collection.find({}).toArray(function(error, result)
			{
				if(error)
				{
					reject(error);
				}
				else
				{
					resolve(result);
				}
			});
		});
	}
};

module.exports = foodsCollection;