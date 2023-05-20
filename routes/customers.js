const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/authorise');

// GET all customers
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a specific customer
router.get('/:id', getCustomer, (req, res) => {
    res.json(res.customer);
});

// CREATE a new customer
router.post('/', async (req, res) => {
    const customer = new Customer({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        address: req.body.address,
        vehicles: req.body.vehicles
    });

    const salt = await bcrypt.genSalt(10);
    customer.password = await bcrypt.hash(customer.password, salt);

    const token = customer.generateAuthToken();

    try {
        const newCustomer = await customer.save();
        res.header('x-auth-token', token).status(201).json(_.pick(newCustomer, ['_id', 'name', 'email', 'phone', 'address', 'vehicles']));
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE a customer
router.patch('/:id', auth, getCustomer, async (req, res) => {
    if (req.body.name != null) {
        res.customer.name = req.body.name;
    }
    if (req.body.email != null) {
        res.customer.email = req.body.email;
    }
    if (req.body.password != null) {
        res.customer.password = req.body.password;
    }
    if (req.body.phone != null) {
        res.customer.phone = req.body.phone;
    }
    if (req.body.address != null) {
        res.customer.address = req.body.address;
    }
    if (req.body.vehicles != null) {
        res.customer.vehicles = req.body.vehicles;
    }

    try {
        const updatedCustomer = await res.customer.save();
        res.json(_pick(updatedCustomer, ['_id', 'name', 'email', 'phone', 'address', 'vehicles']));
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a customer
router.delete('/:id', auth, getCustomer, async (req, res) => {
    try {
        await res.customer.deleteOne();
        res.json({ message: 'Customer deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware function to get a specific customer by ID
async function getCustomer(req, res, next) {
    let customer;

    try {
        customer = await Customer.findById(req.params.id);

        if (customer == null) {
            return res.status(404).json({ message: 'Cannot find customer' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.customer = customer;
    next();
}

module.exports = router;
