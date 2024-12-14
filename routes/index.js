const express = require('express');
const restaurantRoutes = require('./restaurantRoutes');
const menuRoutes = require('./menuRoutes');
const cartRoutes = require('./cartRoutes');
const orderRoutes = require('./orderRoutes');

const router = express.Router();

router.use('/restaurants', restaurantRoutes);
router.use('/menus', menuRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);

module.exports = router;
