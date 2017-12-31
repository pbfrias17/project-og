'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _auth = require('./tools/auth');

var _auth2 = _interopRequireDefault(_auth);

var _roomRouter = require('./routers/roomRouter');

var _roomRouter2 = _interopRequireDefault(_roomRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var port = 4200;

_mongoose2.default.Promise = require('bluebird');
_mongoose2.default.connect(_config2.default.database, { useMongoClient: true }).then(function () {
    console.log('Connected to mlab db \"project-og\"');
}).catch(function (err) {
    console.log('ERR: could not connect to mlab db \"project-og\"');
});

app.use(_express2.default.static('public'));
app.use((0, _cors2.default)());
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());

app.use('/room', _roomRouter2.default);

app.listen(port, function () {
    console.log('Server is listening on Port: ', port);
});

// Seed the database
//var DBSeeder = require('./models/DBSeeder');
//DBSeeder.init(DBSeeder.seedShifts);
//DBSeeder.seedPackages(50);