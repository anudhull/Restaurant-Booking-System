const cartService = require('../services/cartService');

exports.addItemToCart = async (req, res) => {
    const { userId, itemId, quantity } = req.body;
  
    try {
      if (!userId || !itemId || !quantity) {
        return res.status(400).json({ message: 'userId, itemId, quantity are required' });
      }
  
      const cartItem = await cartService.addItemToCart(userId, itemId, quantity, req);
  
      res.status(201).json({ message: 'Item added to cart successfully', cartItem });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error adding item to cart', error: error.message });
    }
};

exports.getCart = async (req, res) => {
  try {
    if (req.session.cart) {
        return res.status(200).json(req.session.cart);
    } else {
        const { userId } = req.query;
        const cartItems = await cartService.getCart(userId);
        res.status(200).json(cartItems);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart items', error });
  }
};
