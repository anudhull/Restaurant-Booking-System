const { Order, Menu, Cart, OrderItems, User, sequelize } = require('../models');

exports.placeOrder = async (userId) => {
    const transaction = await sequelize.transaction();
    try {
        const cartItems = await Cart.findAll({
            where: { user_id: userId },
            include: { model: Menu, as: 'menus' },
            transaction,
        });

        if (!cartItems.length) {
            throw new Error('Cart is empty, add items to the cart before placing an order.');
        }

        const totalPrice = cartItems.reduce((sum, item) => {
            if (!item.menus) {
                throw new Error(`Menu item with id ${item.item_id} not found.`);
            }
            return sum + (item.quantity * item.menus.price);
        }, 0);

        const taxRate = 0.10;
        const totalAmountWithTax = totalPrice + (totalPrice * taxRate);

        const order = await Order.create(
            { 
                user_id: userId, 
                amount: totalPrice,
                total_amount: totalAmountWithTax,
                status: "Pending"
            },
            { transaction }
        );

        const orderItems = cartItems.map(item => ({
            order_id: order.id,
            item_id: item.item_id,
            quantity: item.quantity,
            price: item.menus.price,
        }));
        await OrderItems.bulkCreate(orderItems, { transaction });

        await Cart.destroy({ where: { user_id: userId }, transaction });

        await transaction.commit();

        return order;
    } catch (error) {
        await transaction.rollback();
        throw new Error(`Error placing order: ${error.message}`);
    }
};

exports.fetchOrderByUser = async (userId) => {
    try {
        const order = await Order.findOne({
            where: {
                user_id: userId,
                status: 'Pending',
            },
            include: [
                {
                    model: OrderItems,
                    as: 'items',
                    include: {
                        model: Menu,
                        as: 'menu',
                    },
                },
                {
                    model: User,
                    as: 'user',
                },
            ],
            order: [['createdat', 'DESC']],
        });

        if (!order) {
            throw new Error('No pending orders found for this user');
        }

        const orderDetails = {
            id: order.id,
            user_id: order.user_id,
            amount: order.amount,
            total_amount: order.total_amount,
            createdat: order.createdat,
            updatedat: order.updatedat,
            user: {
                id: order.user.id,
                name: order.user.name,
                email: order.user.email,
            },
            items: order.items.map(item => ({
                menu_id: item.item_id,
                menu_name: item.name,
                quantity: item.quantity,
                price: item.price,
                total_price: item.quantity * item.price,
            })),
        };

        return orderDetails;
    } catch (error) {
        throw new Error(`Error fetching last pending order: ${error.message}`);
    }
};
