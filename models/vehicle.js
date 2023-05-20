const Joi = require('joi');
const mongoose = require('mongoose');

const currentYear = new Date().getFullYear();

const Vehicle = mongoose.model('Vehicle', new mongoose.Schema({
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    model: {
        type: String,
        required: true,
        minlength: 0,
        maxlength: 50
    },
    year: {
        type: Number,
        min: 1886,
        max: currentYear
    },
    price: {
        type: Number,
        min: 0,
        max: 1000000
    },
}));

function validateVehicle(request) {
    const schema = Joi.object({
        brand: Joi.string().min(0).max(50).required(),
        model: Joi.string().min(0).max(50).required(),
        year: Joi.number().min(1900).max(currentYear).required(),
        price: Joi.number().min(0).max(1000000).required()
    });

    return schema.validate(request);
}

module.exports = Vehicle;
module.exports.validate = validateVehicle;