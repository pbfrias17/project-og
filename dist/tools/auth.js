'use strict';

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Helper Methods
var hash = function hash(target) {
    return _bcryptjs2.default.hashSync(target, 8);
};

var compareHash = function compareHash(value, hashedValue) {
    return _bcryptjs2.default.compareSync(value, hashedValue);
};

var createToken = function createToken(payload) {
    return _jsonwebtoken2.default.sign(payload, _config2.default.secret, { expiresIn: 18000 /* 5 hours */ });
};

var verifyToken = function verifyToken(token, callback) {
    _jsonwebtoken2.default.verify(token, _config2.default.secret, function (err, decoded) {
        if (err) console.log(err);

        callback(decoded);
    });
};

// Middlewares
var authenticateRequest = function authenticateRequest(req, res, next) {
    var token = req.headers['x-access-token']; //default http access token handle
    if (!token) return res.status(401).send({ auth: false, error: 'No access token provided.' });

    verifyToken(token, function (decoded) {
        if (decoded) {
            res.locals.decoded = decoded;
            return next();
        } else {
            return res.status(401).send({ auth: false, error: 'Provided token could not be authorized.' });
        }
    });
};

module.exports = {
    hash: hash,
    compareHash: compareHash,
    createToken: createToken,
    verifyToken: verifyToken,
    authenticateRequest: authenticateRequest
};