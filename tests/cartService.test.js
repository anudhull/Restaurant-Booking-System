const cartService = require('../services/cartService');
const { Cart, Menu } = require('../models');

jest.mock('../models', () => ({
  Cart: {
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
  },
  Menu: {
    findOne: jest.fn(),
  },
}));

describe('Cart Service', () => {
  let reqMock;

  beforeEach(() => {
    reqMock = { session: {} };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addItemToCart', () => {
    it('should add a new item to the cart', async () => {
      const mockMenuItem = { id: 1, name: 'Pizza', price: 10 };
      const mockCartItem = { user_id: 1, item_id: 1, quantity: 2, total_price: 20 };

      Menu.findOne.mockResolvedValue(mockMenuItem);
      Cart.findOne.mockResolvedValue(null);
      Cart.create.mockResolvedValue(mockCartItem);

      const result = await cartService.addItemToCart(1, 1, 2, reqMock);

      expect(Menu.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(Cart.findOne).toHaveBeenCalledWith({ where: { user_id: 1, item_id: 1 } });
      expect(Cart.create).toHaveBeenCalledWith({
        user_id: 1,
        item_id: 1,
        quantity: 2,
        total_price: 20,
      });
      expect(result).toEqual(mockCartItem);
      expect(reqMock.session.cart).toContainEqual({
        user_id: 1,
        item_id: 1,
        quantity: 2,
        total_price: 20,
      });
    });

    it('should update the quantity of an existing item in the cart', async () => {
        const mockMenuItem = { id: 1, name: 'Pizza', price: 10 };
        const mockExistingCartItem = {
          user_id: 1,
          item_id: 1,
          quantity: 2,
          total_price: 20,
          save: jest.fn(),
        };
        
        Menu.findOne.mockResolvedValue(mockMenuItem);
        Cart.findOne.mockResolvedValue(mockExistingCartItem);
        Cart.create.mockResolvedValue(mockExistingCartItem);
    
        const req = { session: { cart: [{ user_id: 1, item_id: 1, quantity: 2, total_price: 20 }] } };
    
        const result = await cartService.addItemToCart(1, 1, 3, req);
    
        expect(Menu.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(Cart.findOne).toHaveBeenCalledWith({ where: { user_id: 1, item_id: 1 } });
        expect(mockExistingCartItem.quantity).toBe(5);
        expect(mockExistingCartItem.total_price).toBe(50);
        expect(mockExistingCartItem.save).toHaveBeenCalled();
        expect(req.session.cart).toEqual([
          { user_id: 1, item_id: 1, quantity: 5, total_price: 50 },
        ]);
        expect(result).toEqual(mockExistingCartItem);
      });

    it('should throw an error if the menu item does not exist', async () => {
      Menu.findOne.mockResolvedValue(null);

      await expect(cartService.addItemToCart(1, 99, 2, reqMock)).rejects.toThrow(
        'Menu item not found'
      );
    });

    it('should handle errors during cart addition', async () => {
      Menu.findOne.mockRejectedValue(new Error('Database error'));

      await expect(cartService.addItemToCart(1, 1, 2, reqMock)).rejects.toThrow(
        'Error adding item to cart: Database error'
      );
    });
  });

  describe('getCart', () => {
    it('should return all items in the user\'s cart', async () => {
      const mockCartItems = [
        { user_id: 1, item_id: 1, quantity: 2, total_price: 20 },
        { user_id: 1, item_id: 2, quantity: 1, total_price: 15 },
      ];
      Cart.findAll.mockResolvedValue(mockCartItems);

      const result = await cartService.getCart(1);

      expect(Cart.findAll).toHaveBeenCalledWith({ where: { user_id: 1 } });
      expect(result).toEqual(mockCartItems);
    });

    it('should return an empty array if the cart is empty', async () => {
      Cart.findAll.mockResolvedValue([]);

      const result = await cartService.getCart(1);

      expect(Cart.findAll).toHaveBeenCalledWith({ where: { user_id: 1 } });
      expect(result).toEqual([]);
    });

    it('should handle errors when fetching cart items', async () => {
      Cart.findAll.mockRejectedValue(new Error('Database error'));

      await expect(cartService.getCart(1)).rejects.toThrow('Database error');
    });
  });
});
