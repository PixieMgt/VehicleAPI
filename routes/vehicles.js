const { Vehicle, validate } = require('../models/vehicle');
const express = require('express');

const router = express.Router();

// GET all vehicles
router.get('/', async (req, res) => {
    const vehicles = await Vehicle.find().sort('brand').populate('brand', 'name -_id');
    if (!vehicles) return res.status(404).send('No vehicles found.');

    res.send(vehicles);
});

// GET a vehicle by id
router.get('/:id', async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id).populate('brand', 'name -_id');
    if (!vehicle) return res.status(404).send('Vehicle not found.');

    res.send(vehicle);
});

// POST a new vehicle
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    let vehicle = new Vehicle({
        brand: req.body.brand,
        model: req.body.model,
        year: req.body.year,
        price: req.body.price
    });

    vehicle = await vehicle.save().populate('brand', 'name -_id');

    res.send(vehicle);
});

// PUT a vehicle by id
router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, {
        brand: req.body.brand,
        model: req.body.model,
        year: req.body.year,
        price: req.body.price
    }, { new: true }).populate('brand', 'name -_id');

    if (!vehicle) return res.status(404).send('Vehicle not found.');

    res.send(vehicle);
});

// DELETE a vehicle by id
router.delete('/:id', async (req, res) => {
    const vehicle = await Vehicle.findByIdAndRemove(req.params.id).populate('brand', 'name -_id');
    if (!vehicle) return res.status(404).send('Vehicle not found.');

    res.send(vehicle);
});

module.exports = router;