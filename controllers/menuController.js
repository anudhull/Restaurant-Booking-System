const menuService = require('../services/menuService');

exports.getAllMenus = async (req, res) => {
  try {
    const menus = await menuService.getAllMenus();
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menus', error });
  }
};
