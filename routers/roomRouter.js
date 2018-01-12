import express from 'express';
import uuidv4 from 'uuid/v4';

import auth from '../tools/auth';
import { createRoomId } from '../tools/roomHelper';
import Room from '../db/Room';
import DBHelpers from '../db/helpers';

const roomRouter = express.Router();

roomRouter.route('/open').post((req, res) => {
    let roomId = req.headers['room-id'];

    // Create a 'unique' roomId if none was provided.
    if (!roomId) {
        roomId = createRoomId();
    }
    
    const newRoom = { id: roomId };
    const token = auth.createToken(newRoom);
    newRoom.token = token;

    Room.create(newRoom)
        .then((data) => {
            res.status(200).json({ success: true, message: 'Room has been opened.', roomId, token });
        }).catch((error) => {
            res.status(500).send({ error });
        });
});

roomRouter.route('/close').post((req, res) => {
    // Verify the request is coming from an authenticated source.
    const token = req.headers['x-access-token'];
    const roomId = req.headers['room-id'];

    auth.verifyToken(token)
        .then((decoded) => {
            if (roomId === decoded.id) {
                // Remove all players from the room.

                // Close the room.
                Room.remove({ id: roomId })
                    .then((result) => {
                        if (result.n === 0) {
                            res.status(200).send({ success: false, message: 'That room does not exist.' });
                        } else {
                            res.status(200).send({ success: true, message: 'Room has been closed.' });                        
                        }
                    }).catch((err) => {
                        res.status(500).send({ auth: true, error: 'Could not close room.' });
                    });
            } else {
                res.status(400).send({ auth: false, error: 'Not authorized to close this room.' });
            }
        }).catch((error) => {
            res.status(401).send({ auth: false, error });
        });
});

roomRouter.route('/playerEnter').post((req, res) => {
    const roomId = req.headers['room-id'];
    // Verify the room has capacity for a new player.
    

    // Create new user and add them to the specified room.
    const newPlayer = { id: uuidv4(), name: '' };
    const token = auth.createToken(newPlayer);
    newPlayer.token = token;

    const conditions = { id: roomId };
    const query = { $push: { players: newPlayer } };
    const options = { new: true };
    Room.findOneAndUpdate(conditions, query, options)
        .then((result) => {
            if (result) {
                res.status(200).send({ success: true, message: 'Player entered the room.' });
            } else {
                res.status(200).send({ success: false, message: 'That room could not be found.' });
            }
        }).catch((error) => {
            res.status(500).send({ error });
        }); 
});

roomRouter.route('/playerLeave').post((req, res) => {
    const token = req.headers['x-access-token'];
    let roomId = req.headers['room-id'];
    let playerId = req.headers['player-id'];

    // Verify the request is coming from an authenticated source.
    auth.verifyToken(token)
        .then((decoded) => {
            // Headers are dependent on source of request (Room or Player).
            if (!playerId)
                playerId = decoded.id;
            else
                roomId = decoded.id;

            // Verify player is in target room, then remove them.
            const conditions = { id: roomId };
            const query = { $pull: { players: { id: playerId } } };
            const options = { new: true };
            Room.findOneAndUpdate(conditions, query, options)
                .then((result) => {
                    console.log(result); 
                    res.status(200).send({ success: true, message: 'Player left the room.' });
                    
                    // Close room if no players remain.
                    console.log(result)
                    if (result && result.players.length === 0) {
                        Room.remove({ id: roomId }).exec();
                    }
                }).catch((error) => {
                    res.status(500).send({ error });
                })
        }).catch((error) => {
            res.status(400).send({ auth: false, error });
        })
});

export default roomRouter;