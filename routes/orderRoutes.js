const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/place', orderController.placeOrder);
router.get('/:userId', orderController.fetchOrderByUser);

module.exports = router;
