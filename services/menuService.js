const { Menu } = require('../models');

exports.getAllMenus = async () => {
  return await Menu.findAll();
};

exports.getMenuById = async (id) => {
  return await Menu.findByPk(id);
};

exports.createMenu = async (menuData) => {
  return await Menu.create(menuData);
};