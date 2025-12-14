const Sweet = require('../models/Sweet');

exports.createSweet = async (req, res) => {
    const { name, category, price, quantity } = req.body;

    try {
        const sweet = new Sweet({
            name,
            category,
            price,
            quantity
        });

        const createdSweet = await sweet.save();
        res.status(201).json(createdSweet);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getSweets = async (req, res) => {
    try {
        const sweets = await Sweet.find({});
        res.json(sweets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.searchSweets = async (req, res) => {
    const { name, category } = req.query;
    let query = {};

    if (name) {
        query.name = { $regex: name, $options: 'i' };
    }
    if (category) {
        query.category = { $regex: category, $options: 'i' };
    }

    try {
        const sweets = await Sweet.find(query);
        res.json(sweets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateSweet = async (req, res) => {
    try {
        const sweet = await Sweet.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
        res.json(sweet);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteSweet = async (req, res) => {
    try {
        const sweet = await Sweet.findByIdAndDelete(req.params.id);
        if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
        res.json({ message: 'Sweet removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.purchaseSweet = async (req, res) => {
    const { quantity } = req.body;
    try {
        const sweet = await Sweet.findById(req.params.id);
        if (!sweet) return res.status(404).json({ message: 'Sweet not found' });

        if (sweet.quantity < Number(quantity)) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        sweet.quantity -= Number(quantity);
        await sweet.save();
        res.json(sweet);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.restockSweet = async (req, res) => {
    const { quantity } = req.body;
    try {
        const sweet = await Sweet.findById(req.params.id);
        if (!sweet) return res.status(404).json({ message: 'Sweet not found' });

        sweet.quantity += Number(quantity);
        await sweet.save();
        res.json(sweet);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
