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

// api.get('/validators/username/:username', function (req, res, next)
// {
//     console.log("validators/username called");
//     var list = ['jesse', 'james', 'cow'];
//     var attemptedName = req.params.username;
//     // [jwarden 2.23.2015] TODO: Really need some string / number validation here.
//     if(_.find(list, function(item)
//         {
//             return attemptedName == item;
//         }) != undefined)
//     {
//         res.send(200, {response: {
//                             available: false,
//                             error: 'Username is taken.',
//                         }});
//     }
//     else
//     {
//         res.send(200, {response: {
//                             available: true
//                         }});
//     }
// });

// api.get('/validators/creditcard/:creditcard', function (req, res, next)
// {
//     console.log("validators/creditcard called");
//     if(wdprValidators.isCreditCard(req.params.creditcard) === true)
//     {
//         res.send(200, {response: {
//                             valid: true
//                         }});
//     }
//     else
//     {
//         res.send(200, {response: {
//                             valid: false,
//                             error: 'This is not a valid credit card number.'
//                         }});
//     }
// });

// api.post('/validators/remember', function(req, res, next)
// {
//     console.log("validators::remember");

//     var validArray = wdprValidators.checkBoolean(req.body.remember);
//     var response;
//     if(validArray.length <= 0)
//     {
//         response = "Valid boolean.";
//     }
//     else
//     {
//         response = validArray[0];
//     }
//    res.send(200, {response: {
//                                 valid: response
//                             }});
// });
