import express from 'express';
import uuidv4 from 'uuid/v4';

import auth from '../tools/auth';
import Room from '../db/Room';
import DBHelpers from '../db/helpers';

const roomRouter = express.Router();

roomRouter.route('/open').post((req, res) => {
    const { id } = req.headers;
    const newRoom = { id };
    const token = auth.createToken(newRoom);
    newRoom.token = token;
    console.log(newRoom);
    Room.create(newRoom)
        .then((data) => {
            res.status(200).send('ok');
        }).catch((err) => {
            res.status(500).send({ error: err });
        });
});

roomRouter.route('/close').post((req, res) => {
    // Verify the request is coming from an authenticated source.
    const token = req.headers['x-access-token'];
    const id = req.headers['id'];

    auth.verifyToken(token)
        .then((decoded) => {
            if (id === decoded.id) {
                Room.remove({ id })
                .then((result) => {
                    res.status(200).send({ auth: true });
                }).catch((err) => {
                    res.status(500).send({ auth: true, error: 'Could not close room.' });
                });
            } else {
                res.status(400).send({ auth: false, error: 'Not authorized to close this room' });
            }
        }).catch((err) => {
            res.status(401).send({ auth: false, error: 'Access token could not be authenticated.' });
        });
});

roomRouter.route('/playerEnter').post((req, res) => {
    const { id } = req.headers;

    // Verify the room has capacity for a new player,


    // Create new user and add them to the specified room.
    const newPlayer = { id: uuidv4(), name: '' };
    const token = auth.createToken(newPlayer);
    newPlayer.token = token;

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