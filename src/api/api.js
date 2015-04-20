console.log('Loading restify server...');

var restify = require('restify');
var redisServer   = require("redis");
var redis  = redis.createClient();
var OAuth = require('oauth');

client.on("error", function (err)
{
    console.error("Resis Error:", err);
});

/*
client.set("string key", "string val", redis.print);
client.hset("hash key", "hashtest 1", "some value", redis.print);
client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
client.hkeys("hash key", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    client.quit();
});
*/

var api = restify.createServer({name: 'fitbit-restify'});
api.listen(process.env.PORT || 5000, function () {
    console.log('%s listening at %s', api.name, api.url)
});

// api.pre(restify.CORS({
//     origins: ['*'],
//     credentials: false,
//     headers: ['X-Requested-With', 'Authorization']
// }));
// api.pre(restify.fullResponse());

// api.use(restify.bodyParser());

var fitbit = {

    _oauth: null,

    getOAuth: function()
    {
        if(this._oauth)
        {
            return this._oauth;
        }
        
        this._oauth = new OAuth.OAuth(
          'https://api.fitbit.com/oauth/request_token',
          'https://api.fitbit.com/oauth/access_token',
          '98cfee4f81cdd2e3f1776e02f306a4c3',
          'd525f09fe368f91dbe9f02c57fbcf6ba',
          '1.0',
          null,
          'HMAC-SHA1'
        );
        return this._oauth;
    }
};

api.get('/ping', function (req, res, next) {
    console.log("ping called");
    res.send(200, {response: true});
});

api.get('/callback', function(req, res, next)
{
    console.log('callback called');
    res.send(200);
});

api.post('/incoming', function(req, res, next)
{
    console.log("incoming called");
    console.log('header, X-Fitbit-Signature:', req.header('X-Fitbit-Signature'));
   res.send(204);
});

api.get('/', function(req, res) {
    console.log('default called');
    res.send(200);
});

