const express = require('express');
const { Garage, validate } = require('../models/garage');

const router = express.Router();

// GET all garages
router.get('/', async (req, res) => {
    const garages = await Garage.find().sort('city').populate('vehicles', '-_id');
    if (!garages) return res.status(404).send('No garages found.');

    res.send(garages);
});

// GET a specific garage by ID
router.get('/:id', async (req, res) => {
    const garage = await Garage.findById(req.params.id).populate('vehicles', '-_id');
    if (!garage) return res.status(404).send('Garage not found.');

    res.send(garage);
});

// POST a new garage
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    let garage = new Garage({
        name: req.body.name,
        city: req.body.city,
        vehicles: req.body.vehicles
    });

    garage = await garage.save();
    garage = await Garage.findById(garage._id).populate('vehicles', '-_id');

    res.send(garage);
});

// PUT (update) an existing garage by ID
router.put('/:id', async (req, res) => {
    const garage = await Garage.findByIdAndUpdate(req.params.id, {
        city: req.body.city,
        vehicles: req.body.vehicles
    }, { new: true });

    if (!garage) return res.status(404).send('Garage not found.');

    res.send(garage);
});

// DELETE a garage by ID
router.delete('/:id', async (req, res) => {
    const garage = await Garage.findByIdAndRemove(req.params.id);

    if (!garage) return res.status(404).send('Garage not found.');

    res.send(garage);
});

module.exports = router;