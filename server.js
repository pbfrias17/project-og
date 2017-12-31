import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

import config from './config';
import auth from './tools/auth';
import roomRouter from './routers/roomRouter';

var app = express();
var port = 4200;

mongoose.Promise = require('bluebird');
mongoose.connect(config.database, { useMongoClient: true })
    .then(() => {
        console.log('Connected to mlab db \"project-og\"');
    })
    .catch((err) => {
        console.log('ERR: could not connect to mlab db \"project-og\"');
    });

app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/room', roomRouter);

app.listen(port, () => {
    console.log('Server is listening on Port: ', port);
});

// Seed the database
//var DBSeeder = require('./models/DBSeeder');
//DBSeeder.init(DBSeeder.seedShifts);
//DBSeeder.seedPackages(50);


