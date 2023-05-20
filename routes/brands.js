const express = require('express');
const router = express.Router();
const Brand = require('../models/brand');
const Vehicle = require('../models/vehicle');

// GET all brands
router.get('/', async (req, res) => {
    try {
        const brands = await Brand.find();
        res.json(brands);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a specific brand by id
router.get('/:id', getBrand, (req, res) => {
    res.json(res.brand);
});

// CREATE a new brand
router.post('/', async (req, res) => {
    const brand = new Brand({
        name: req.body.name
    });

    try {
        const newBrand = await brand.save();
        res.status(201).json(newBrand);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE a brand by id
router.patch('/:id', getBrand, async (req, res) => {
    if (req.body.name != null) {
        res.brand.name = req.body.name;
    }

    try {
        const updatedBrand = await res.brand.save();
        res.json(updatedBrand);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a brand by id
router.delete('/:id', getBrand, async (req, res) => {
    try {
        await res.brand.remove();
        res.json({ message: 'Brand deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET all vehicles for a specific brand by id
router.get('/:id/vehicles', getBrand, async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ brand: res.brand.id });
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware function to get a specific brand by id
async function getBrand(req, res, next) {
    let brand;
    try {
        brand = await Brand.findById(req.params.id);
        if (brand == null) {
            return res.status(404).json({ message: 'Cannot find brand' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.brand = brand;
    next();
}

module.exports = router;
