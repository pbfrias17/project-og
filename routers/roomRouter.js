import express from 'express';

import auth from '../tools/auth';
import Room from '../db/Room';
import DBHelpers from '../db/helpers';

const roomRouter = express.Router();

roomRouter.route('/open').post((req, res) => {
    const { id } = req.headers;

    DBHelpers.openRoom(id)
        .then((data) => {
            console.log(data);
            res.status(200).send('ok');
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('oh no');
        });
});

roomRouter.route('/close').post((req, res) => {
    // 
});

roomRouter.route('/playerEnter').post((req, res) => {
    const { id } = req.headers;

    // Verify the room has capacity for a new player,


    // Create new user.
    const newPlayer = { name: 'dave', token: 'd4v3zT0k3N' };
    Room.findOneAndUpdate({ id }, { $push: { players: newPlayer } }, (err, doc, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Player could not enter room');
        } else {
            res.status(200).send(result);
        }
    }); 
});

roomRouter.route('/playerLeave').post((req, res) => {
    // Verify player is in target room, then remove them.

    // Close room if no players remain.
});

export default roomRouter;