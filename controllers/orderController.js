const orderService = require('../services/orderService');

exports.placeOrder = async (req, res) => {
    const userId = req.query.userId;

    try {
        const order = await orderService.placeOrder(userId);
        res.status(201).json({
            message: 'Order placed successfully',
            order,
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error placing order',
            error: error.message,
        });
    }
};

exports.fetchOrderByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const orderDetails = await orderService.fetchOrderByUser(userId);

        return res.json(orderDetails);
    } catch (error) {
        console.error('Error fetching last pending order:', error);
        return res.status(500).json({
            message: 'Error fetching order details',
            error: error.message,
        });
    }
};