const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const CONFIG = require('./config.json');

const app = express();
const dbUser = CONFIG.dbUser;
const dbPassword = CONFIG.dbPassword;
const uri = `mongodb+srv://${dbUser}:${dbPassword}@vehicleapi.fc7h9zw.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/authenticate'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/brands', require('./routes/brands'));
app.use('/api/garages', require('./routes/garages'));
app.use('/api/customers', require('./routes/customers'));

const config = require('config');
// if (!config.get('jwtPrivateKey')) {
//     console.error('FATAL ERROR: environment variable VehicleAPI_jwtPrivateKey is not defined.');
//     process.exit(1);
// };

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));