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

var verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) return reject(err);
            
            resolve(decoded);
        });
    });
};

module.exports = {
    hash,
    compareHash,
    createToken,
    verifyToken,
};