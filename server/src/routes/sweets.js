const express = require('express');
const router = express.Router();
const {
    createSweet,
    getSweets,
    searchSweets,
    updateSweet,
    deleteSweet,
    purchaseSweet,
    restockSweet
} = require('../controllers/sweetsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/search', protect, searchSweets);

router.route('/')
    .post(protect, admin, createSweet)
    .get(protect, getSweets);

router.route('/:id')
    .put(protect, admin, updateSweet)
    .delete(protect, admin, deleteSweet);

router.post('/:id/purchase', protect, purchaseSweet);
router.post('/:id/restock', protect, admin, restockSweet);

module.exports = router;
