const restaurantService = require('../services/restaurantService');
const { Restaurant, Menu } = require('../models');
const { Sequelize } = require('sequelize');

jest.mock('../models', () => ({
  Restaurant: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  Menu: {
    findAll: jest.fn(),
  },
}));

describe('Restaurant Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllRestaurants', () => {
    it('should return a list of all restaurants', async () => {
      const mockRestaurants = [{ id: 1, name: 'Pizza Palace' }];
      Restaurant.findAll.mockResolvedValue(mockRestaurants);

      const result = await restaurantService.getAllRestaurants();
      expect(Restaurant.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockRestaurants);
    });

    it('should return an empty array if no restaurants are found', async () => {
        Restaurant.findAll.mockResolvedValue([]);
        const result = await restaurantService.getAllRestaurants();
        expect(result).toEqual([]);
    });
  });

  describe('searchRestaurants', () => {
    it('should return a list of restaurants matching the search term', async () => {
      const mockRestaurantsByName = [{ id: 1, name: 'Pizza Palace' }];
      const mockMenusByName = [
        { id: 2, restaurant: { id: 2, name: 'Burger Bistro' } },
      ];
      Restaurant.findAll.mockResolvedValue(mockRestaurantsByName);
      Menu.findAll.mockResolvedValue(mockMenusByName);

      const result = await restaurantService.searchRestaurants('Pizza');
      expect(Restaurant.findAll).toHaveBeenCalledWith({
        where: { name: { [Sequelize.Op.iLike]: '%Pizza%' } },
        include: [{ model: Menu, as: 'menus' }],
      });
      expect(Menu.findAll).toHaveBeenCalledWith({
        where: { name: { [Sequelize.Op.iLike]: '%Pizza%' } },
        include: [{ model: Restaurant, as: 'restaurant' }],
      });
      expect(result).toEqual([
        { id: 1, name: 'Pizza Palace' },
        { id: 2, name: 'Burger Bistro' },
      ]);
    });

    it('should handle errors during the search', async () => {
      Restaurant.findAll.mockRejectedValue(new Error('Search error'));

      await expect(restaurantService.searchRestaurants('Error')).rejects.toThrow(
        'Error searching restaurants: Search error'
      );
    });
  });

  describe('getRestaurantDetails', () => {
    it('should return restaurant details along with its menus', async () => {
      const mockRestaurantDetails = {
        id: 1,
        name: 'Pizza Palace',
        menus: [
          { id: 101, name: 'Margherita', description: 'Classic Cheese Pizza', price: 10 },
          { id: 102, name: 'Pepperoni', description: 'Pepperoni Pizza', price: 12 },
        ],
      };
  
      Restaurant.findOne = jest.fn().mockResolvedValue(mockRestaurantDetails);
  
      const result = await restaurantService.getRestaurantDetails(1);
  
      expect(Restaurant.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        include: [
          {
            model: Menu,
            as: 'menus',
            attributes: ['id', 'name', 'description', 'price'],
          },
        ],
      });
  
      expect(result).toEqual(mockRestaurantDetails);
    });
  
    it('should handle errors when fetching restaurant details', async () => {
      Restaurant.findOne = jest.fn().mockRejectedValue(new Error('Database error'));
  
      await expect(restaurantService.getRestaurantDetails(1)).rejects.toThrow(
        'Error fetching restaurant details: Database error'
      );
    });
  });
  
});
