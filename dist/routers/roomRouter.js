'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _auth = require('../tools/auth');

var _auth2 = _interopRequireDefault(_auth);

var _Room = require('../db/Room');

var _Room2 = _interopRequireDefault(_Room);

var _helpers = require('../db/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var roomRouter = _express2.default.Router();

roomRouter.route('/open').post(function (req, res) {
    var id = req.headers.id;


    _helpers2.default.openRoom(id).then(function (data) {
        console.log(data);
        res.status(200).send('ok');
    }).catch(function (err) {
        console.log(err);
        res.status(500).send('oh no');
    });
});

roomRouter.route('/close').post(function (req, res) {
    // 
});

roomRouter.route('/playerEnter').post(function (req, res) {
    var id = req.headers.id;

    // Verify the room has capacity for a new player,


    // Create new user and add them to the specified room.

    var newPlayer = { id: (0, _v2.default)(), name: '' };
    var token = _auth2.default.createToken(newPlayer);
    newPlayer.token = token;

    _Room2.default.findOneAndUpdate({ id: id }, { $push: { players: newPlayer } }, function (err, doc, result) {
        if (err) {
            console.log(err);
            res.status(500).send('Player could not enter room');
        } else {
            res.status(200).send(result);
        }
    });
});

roomRouter.route('/playerLeave').post(function (req, res) {
    // Verify player is in target room, then remove them.

    // Close room if no players remain.
});

exports.default = roomRouter;