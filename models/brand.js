const Joi = require('joi');
const mongoose = require('mongoose');

const currentYear = new Date().getFullYear();

const Brand = mongoose.model('Brand', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 0,
        maxlength: 50
    },
    country: {
        type: String,
        required: true,
        minlength: 0,
        maxlength: 50
    },
    founded: {
        type: Number,
        required: true,
        min: 1886,
        max: currentYear
    }
}));

function validateBrand(request) {
    const schema = Joi.object({
        name: Joi.string().min(0).max(50).required(),
        country: Joi.string().min(0).max(50).required(),
        founded: Joi.number().min(1900).max(currentYear).required()
    });

    return schema.validate(request);
}

exports.Brand = Brand;
exports.validate = validateBrand;