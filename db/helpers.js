import mongoose from 'mongoose';
import Room from './Room';

function openRoom(id) {
    return Room.create({ id });
}

module.exports = {
    openRoom,
};