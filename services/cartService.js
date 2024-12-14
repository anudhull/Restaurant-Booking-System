const { Cart, Menu } = require('../models');

exports.addItemToCart = async (userId, itemId, quantity, req) => {
  try {
    const menuItem = await Menu.findOne({ where: { id: itemId } });

    if (!menuItem) {
      throw new Error('Menu item not found');
    }

    if (!req.session.cart) {
        req.session.cart = [];
      }

    const existingCartItem = await Cart.findOne({ where: { user_id: userId, item_id: itemId } });

    if (existingCartItem) {
        existingCartItem.quantity += quantity;
        existingCartItem.total_price = existingCartItem.quantity * menuItem.price;
        await existingCartItem.save();

        const sessionCartItem = req.session.cart.find(item => item.item_id === itemId);
        if (sessionCartItem) {
          sessionCartItem.quantity = existingCartItem.quantity;
          sessionCartItem.total_price = existingCartItem.total_price;
        }
        return existingCartItem;
    } else {
        const cartItem = await Cart.create({
            user_id: userId,
            item_id: itemId,
            quantity,
            total_price: menuItem.price * quantity,
          });

          
        req.session.cart.push({
            user_id: userId,
            item_id: itemId,
            quantity,
            total_price: menuItem.price * quantity,
        });
        return cartItem;
    }
  } catch (error) {
    throw new Error(`Error adding item to cart: ${error.message}`);
  }
};

exports.getCart = async (userId) => {
  return await Cart.findAll({ where: { user_id: userId} });
};
