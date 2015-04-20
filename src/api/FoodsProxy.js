var Promise = require("bluebird");

function ajaxGetAsync(url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest;
        xhr.addEventListener("error", reject);
        xhr.addEventListener("load", resolve);
        xhr.open("GET", url);
        xhr.send(null);
    });
}

var FoodsProxy = function(db)
{
	return {
		insertFood: function(food)
		{
			return new Promise(function(resolve, reject)
			{
				var collection = db.collection('foods');
				collection.insert(food, function(err, result)
				{
					if(err)
					{
						return reject(err);
					}
					return resolve(result);
				});
			});
		}
	};

};
module.exports = FoodsProxy;