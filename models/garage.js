const mongoose = require('mongoose');
const Joi = require('joi');

const Garage = mongoose.model('Garage', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 0,
        maxlength: 50
    },
    city: {
        type: String,
        minlength: 0,
        maxlength: 50
    },
    vehicles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle'
    }]
}));

function validateGarage(garage) {
    const schema = Joi.object({
        name: Joi.string().required().min(0).max(50),
        city: Joi.string().required().min(0).max(50),
        vehicles: Joi.array().items(Joi.objectId().required())
    });

    return schema.validate(garage);
}

module.exports = Garage;
module.exports.validate = validateGarage;