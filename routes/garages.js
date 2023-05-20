const express = require('express');
const router = express.Router();
const Garage = require('../models/garage');

// GET all garages
router.get('/', async (req, res) => {
    try {
        const garages = await Garage.find();
        res.json(garages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a specific garage
router.get('/:id', getGarage, (req, res) => {
    res.json(res.garage);
});

// CREATE a new garage
router.post('/', async (req, res) => {
    const garage = new Garage({
        name: req.body.name,
        location: req.body.location,
        capacity: req.body.capacity
    });

    try {
        const newGarage = await garage.save();
        res.status(201).json(newGarage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE a garage
router.patch('/:id', getGarage, async (req, res) => {
    if (req.body.name != null) {
        res.garage.name = req.body.name;
    }
    if (req.body.location != null) {
        res.garage.location = req.body.location;
    }
    if (req.body.capacity != null) {
        res.garage.capacity = req.body.capacity;
    }

    try {
        const updatedGarage = await res.garage.save();
        res.json(updatedGarage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a garage
router.delete('/:id', getGarage, async (req, res) => {
    try {
        await res.garage.remove();
        res.json({ message: 'Garage deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware function to get a specific garage by ID
async function getGarage(req, res, next) {
    let garage;
    try {
        garage = await Garage.findById(req.params.id);
        if (garage == null) {
            return res.status(404).json({ message: 'Cannot find garage' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.garage = garage;
    next();
}

module.exports = router;
