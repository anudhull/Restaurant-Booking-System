const menuService = require('../services/menuService');
const { Menu } = require('../models');

jest.mock('../models', () => ({
  Menu: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
}));

describe('Menu Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllMenus', () => {
    it('should return a list of all menus', async () => {
      const mockMenus = [
        { id: 1, name: 'Margherita', description: 'Cheese Pizza', price: 10 },
      ];
      Menu.findAll.mockResolvedValue(mockMenus);

      const result = await menuService.getAllMenus();
      expect(Menu.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockMenus);
    });

    it('should return an empty array if no menus are found', async () => {
      Menu.findAll.mockResolvedValue([]);

      const result = await menuService.getAllMenus();
      expect(Menu.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should handle errors when fetching all menus', async () => {
      Menu.findAll.mockRejectedValue(new Error('Database error'));

      await expect(menuService.getAllMenus()).rejects.toThrow('Database error');
    });
  });
});
