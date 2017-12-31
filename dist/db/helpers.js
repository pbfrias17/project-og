'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _Room = require('./Room');

var _Room2 = _interopRequireDefault(_Room);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function openRoom(id) {
    return _Room2.default.create({ id: id });
}

module.exports = {
    openRoom: openRoom
};