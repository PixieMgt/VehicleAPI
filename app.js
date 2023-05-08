const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const vehicles = require('./routes/vehicles');
const express = require('express');
const CONFIG = require('./config.json');

const app = express();
const dbUser = CONFIG.dbUser;
const dbPassword = CONFIG.dbPassword;
const uri = `mongodb+srv://${dbUser}:${dbPassword}@vehicleapi.fc7h9zw.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/vehicles', vehicles);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));