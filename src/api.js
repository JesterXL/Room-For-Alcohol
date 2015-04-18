console.log('Loading restify server...');

var restify = require('restify');

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

app.get('/', function(req, res) {
    console.log('default called');
    res.send(200);
});

app.get('*', function(req, res) {
    console.log('uber default called');
    res.send(200);
});