import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config';

// Helper Methods
var hash = (target) => {
    return bcrypt.hashSync(target, 8);
};

var compareHash = (value, hashedValue) => {
    return bcrypt.compareSync(value, hashedValue);
};

var createToken = (payload) => {
    return jwt.sign(
               payload, 
               config.secret, 
               { expiresIn: 18000 /* 5 hours */ }
    );
};

var verifyToken = (token, callback) => {
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err)
            console.log(err);

        callback(decoded);
    });
};

// Middlewares
var authenticateRequest = (req, res, next) => {
    var token = req.headers['x-access-token']; //default http access token handle
    if (!token)
        return res.status(401)
                  .send({ auth: false, error: 'No access token provided.' });

    verifyToken(token, (decoded) => {
        if (decoded) {
            res.locals.decoded = decoded;
            return next();
        } else {
            return res.status(401)
                      .send({ auth: false, error: 'Provided token could not be authorized.' });
        }
    });
};

module.exports = {
    hash,
    compareHash,
    createToken,
    verifyToken,
    authenticateRequest
};