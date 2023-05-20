const express = require('express');
const router = express.Router();
const Vehicle = require('../models/vehicle');
const auth = require('../middleware/authorise');

// Get all vehicles
router.get('/', async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one vehicle
router.get('/:id', getVehicle, (req, res) => {
    res.json(res.vehicle);
});

// Create one vehicle
router.post('/', auth, async (req, res) => {
    const vehicle = new Vehicle({
        brand: req.body.make,
        model: req.body.model,
        year: req.body.year,
        price: req.body.price
    });

    try {
        const newVehicle = await vehicle.save();
        res.status(201).json(newVehicle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update one vehicle
router.patch('/:id', auth, getVehicle, async (req, res) => {
    if (req.body.brand != null) {
        res.vehicle.brand = req.body.brand;
    }
    if (req.body.model != null) {
        res.vehicle.model = req.body.model;
    }
    if (req.body.year != null) {
        res.vehicle.year = req.body.year;
    }
    if (req.body.price != null) {
        res.vehicle.price = req.body.price;
    }

    try {
        const updatedVehicle = await res.vehicle.save();
        res.json(updatedVehicle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete one vehicle
router.delete('/:id', auth, getVehicle, async (req, res) => {
    try {
        await res.vehicle.deleteOne();
        res.json({ message: 'Deleted Vehicle' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getVehicle(req, res, next) {
    let vehicle;
    try {
        vehicle = await Vehicle.findById(req.params.id);
        if (vehicle == null) {
            return res.status(404).json({ message: 'Cannot find vehicle' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.vehicle = vehicle;
    next();
}

module.exports = router;
