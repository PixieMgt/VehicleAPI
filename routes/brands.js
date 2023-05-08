const { Brand, validate } = require('../models/brand');
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// GET all brands
router.get('/', async (req, res) => {
    const brands = await Brand.find().sort('name');
    if (!brands) return res.status(404).send('No brands found.');

    res.send(brands);
});

// GET a brand by id
router.get('/:id', async (req, res) => {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).send('Brand not found.');

    res.send(brand);
});

// POST a new brand
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    let brand = new Brand({
        name: req.body.name,
        country: req.body.country,
        founded: req.body.founded
    });

    brand = await brand.save();

    res.send(brand);
});

// PUT a brand by id
router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    const brand = await Vehicle.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        country: req.body.country,
        founded: req.body.founded
    }, { new: true });

    if (!brand) return res.status(404).send('Brand not found.');

    res.send(brand);
});

// DELETE a brand by id
router.delete('/:id', async (req, res) => {
    const brand = await Brand.findByIdAndRemove(req.params.id);
    if (!brand) return res.status(404).send('Brand not found.');

    res.send(brand);
});

module.exports = router;