var express        = require('express');
var bodyParser     = require('body-parser');

var utils          = require('./libs/utils');
var auth           = require('./routes/auth');
var lights         = require('./routes/lights');
var index          = require('./routes/index');

var app          = express();
var port         = 9881;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', auth);
app.use('/lights', utils.verifyAuthenticate, lights);
app.use('/', utils.verifyAuthenticate, index);

app.use(function(err, req, res, next) {
    console.error('ERROR HANDLING', err);

    res.status(500).json({error: !!err.sqlMessage ? err.sqlMessage : err.message});
    next(err);
});

app.listen(port, function () {
  console.log('Listening on port '+ port +'!');
});
