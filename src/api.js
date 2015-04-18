console.log('Loading restify server...');

var restify = require('restify');

var api = restify.createServer({name: 'fitbit-restify'});
api.listen(3000, function () {
    console.log('%s listening at %s', api.name, api.url)
});

// api.pre(restify.CORS({
//     origins: ['*'],
//     credentials: false,
//     headers: ['X-Requested-With', 'Authorization']
// }));
api.pre(restify.fullResponse());

api.use(restify.bodyParser());

api.get('/ping', function (req, res, next) {
    console.log("ping called");
    res.send(200, {response: true});
});

