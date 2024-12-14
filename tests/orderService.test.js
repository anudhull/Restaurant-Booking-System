const orderService = require('../services/orderService');
const { Order, Menu, Cart, OrderItems, User, sequelize } = require('../models');

jest.mock('../models', () => ({
  Order: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
  Menu: {
    findOne: jest.fn(),
  },
  Cart: {
    findAll: jest.fn(),
    destroy: jest.fn(),
  },
  OrderItems: {
    bulkCreate: jest.fn(),
  },
  User: {
    findOne: jest.fn(),
  },
  sequelize: {
    transaction: jest.fn(),
  },
}));

describe('Order Service', () => {
  let transaction;

  beforeEach(() => {
    transaction = {
      commit: jest.fn(),
      rollback: jest.fn(),
    };
    sequelize.transaction.mockResolvedValue(transaction);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('placeOrder', () => {
    it('should place an order successfully', async () => {
      const mockCartItems = [
        { item_id: 1, quantity: 2, menus: { price: 10 } },
        { item_id: 2, quantity: 1, menus: { price: 20 } },
      ];

      const mockOrder = {
        id: 1,
        user_id: 1,
        amount: 40,
        total_amount: 44,
        status: 'Pending',
      };

      const mockOrderItems = [
        { order_id: 1, item_id: 1, quantity: 2, price: 10 },
        { order_id: 1, item_id: 2, quantity: 1, price: 20 },
      ];

      Cart.findAll.mockResolvedValue(mockCartItems);
      Menu.findOne.mockResolvedValueOnce({ price: 10 }).mockResolvedValueOnce({ price: 20 });
      Order.create.mockResolvedValue(mockOrder);
      OrderItems.bulkCreate.mockResolvedValue(mockOrderItems);
      Cart.destroy.mockResolvedValue();

      const req = { session: {} };

      const result = await orderService.placeOrder(1);

      expect(Cart.findAll).toHaveBeenCalledWith({ where: { user_id: 1 }, include: { model: Menu, as: 'menus' }, transaction });
      expect(Order.create).toHaveBeenCalledWith(
        { user_id: 1, amount: 40, total_amount: 44, status: 'Pending' },
        { transaction }
      );
      expect(OrderItems.bulkCreate).toHaveBeenCalledWith(mockOrderItems, { transaction });
      expect(Cart.destroy).toHaveBeenCalledWith({ where: { user_id: 1 }, transaction });
      expect(transaction.commit).toHaveBeenCalled();

      expect(result).toEqual(mockOrder);
    });

    it('should throw an error if cart is empty', async () => {
      Cart.findAll.mockResolvedValue([]);

      const req = { session: {} };

      await expect(orderService.placeOrder(1)).rejects.toThrow('Cart is empty, add items to the cart before placing an order.');
    });

    it('should throw an error if menu item is not found', async () => {
      const mockCartItems = [{ item_id: 1, quantity: 2, menus: null }];

      Cart.findAll.mockResolvedValue(mockCartItems);
      Menu.findOne.mockResolvedValue(null);

      const req = { session: {} };

      await expect(orderService.placeOrder(1)).rejects.toThrow('Menu item with id 1 not found.');
    });

    it('should handle transaction failure and rollback', async () => {
      const mockCartItems = [
        { item_id: 1, quantity: 2, menus: { price: 10 } },
        { item_id: 2, quantity: 1, menus: { price: 20 } },
      ];

      const mockOrder = {
        id: 1,
        user_id: 1,
        amount: 40,
        total_amount: 44,
        status: 'Pending',
      };

      Cart.findAll.mockResolvedValue(mockCartItems);
      Menu.findOne.mockResolvedValueOnce({ price: 10 }).mockResolvedValueOnce({ price: 20 });
      Order.create.mockResolvedValue(mockOrder);
      OrderItems.bulkCreate.mockRejectedValue(new Error('Database error'));

      const req = { session: {} };

      await expect(orderService.placeOrder(1)).rejects.toThrow('Error placing order: Database error');

      expect(transaction.rollback).toHaveBeenCalled();
    });
  });

  describe('fetchOrderByUser', () => {
    it('should fetch the pending order for a user', async () => {
      const mockOrder = {
        id: 1,
        user_id: 1,
        amount: 40,
        total_amount: 44,
        createdat: '2024-12-14',
        updatedat: '2024-12-14',
        user: { id: 1, name: 'Anisha Mittal', email: 'anisham@gmail.com' },
        items: [
          { item_id: 1, quantity: 2, price: 10, name: 'Pizza', total_price: 20 },
          { item_id: 2, quantity: 1, price: 20, name: 'Burger', total_price: 20 },
        ],
      };

      Order.findOne.mockResolvedValue(mockOrder);

      const result = await orderService.fetchOrderByUser(1);

      expect(Order.findOne).toHaveBeenCalledWith({
        where: { user_id: 1, status: 'Pending' },
        include: [
          {
            model: OrderItems,
            as: 'items',
            include: { model: Menu, as: 'menu' },
          },
          { model: User, as: 'user' },
        ],
        order: [['createdat', 'DESC']],
      });

      expect(result).toEqual({
        id: 1,
        user_id: 1,
        amount: 40,
        total_amount: 44,
        createdat: '2024-12-14',
        updatedat: '2024-12-14',
        user: { id: 1, name: 'Anisha Mittal', email: 'anisham@gmail.com' },
        items: [
          { menu_id: 1, menu_name: 'Pizza', quantity: 2, price: 10, total_price: 20 },
          { menu_id: 2, menu_name: 'Burger', quantity: 1, price: 20, total_price: 20 },
        ],
      });
    });

    it('should throw an error if no pending order is found', async () => {
      Order.findOne.mockResolvedValue(null);

      await expect(orderService.fetchOrderByUser(1)).rejects.toThrow('No pending orders found for this user');
    });
  });
});
