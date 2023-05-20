const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        minlength: 0,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 0,
        maxlength: 255,
        unique: true
    },
    phone: {
        type: String,
        minlength: 0,
        maxlength: 50
    },
    address: {
        type: String,
        minlength: 0,
        maxlength: 255
    },
    vehicles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle'
    }]
}));

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(0).max(50).required(),
        email: Joi.string().min(0).max(255).required().email(),
        phone: Joi.string().min(0).max(50).required(),
        address: Joi.string().min(0).max(255).required(),
        vehicles: Joi.array().items(Joi.string().min(0).max(50))
    });

    return schema.validate(customer);
}

module.exports = Customer;
module.exports.validate = validateCustomer;