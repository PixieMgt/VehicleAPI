const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const dbUser = process.env.VehicleAPI_dbUser;
const dbPassword = process.env.VehicleAPI_dbPassword;
const uri = `mongodb+srv://${dbUser}:${dbPassword}@vehicleapi.fc7h9zw.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
// Parses incoming request bodies before handlers (available under req.body)
app.use(bodyParser.json());
// Parses incoming URL-encoded request bodies before handlers (available under req.body), extended: true means req.body can be any type (not just strings or arrays)
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/authenticate'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/brands', require('./routes/brands'));
app.use('/api/garages', require('./routes/garages'));
app.use('/api/customers', require('./routes/customers'));

if (!process.env.VehicleAPI_jwtPrivateKey) {
    console.error('FATAL ERROR: environment variable VehicleAPI_jwtPrivateKey is not defined.');
    process.exit(1);
};

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));