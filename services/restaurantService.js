const { Restaurant, Menu } = require('../models');
const { Sequelize } = require('sequelize');

exports.getAllRestaurants = async () => {
  return await Restaurant.findAll();
};

exports.getRestaurantById = async (id) => {
  return await Restaurant.findByPk(id);
};

exports.createRestaurant = async (restaurantData) => {
  return await Restaurant.create(restaurantData);
};

exports.updateRestaurant = async (id, updateData) => {
  const restaurant = await Restaurant.findByPk(id);
  if (restaurant) {
    return await restaurant.update(updateData);
  }
  throw new Error('Restaurant not found');
};

exports.deleteRestaurant = async (id) => {
  const restaurant = await Restaurant.findByPk(id);
  if (restaurant) {
    await restaurant.destroy();
    return { message: 'Restaurant deleted successfully' };
  }
  throw new Error('Restaurant not found');
};

exports.searchRestaurants = async (searchTerm) => {
    try {
        // Search for restaurants by name
        const restaurantsByName = await Restaurant.findAll({
            where: {
                name: { [Sequelize.Op.iLike]: `%${searchTerm}%` },
                },
                include: [
                    {
                        model: Menu,
                        as: 'menus',
                    },
                ],
        });
    
        // Search for restaurants by menu name
        const menusByName = await Menu.findAll({
            where: {
                name: { [Sequelize.Op.iLike]: `%${searchTerm}%` },
                },
                include: [
                    {
                        model: Restaurant,
                        as: 'restaurant',
                    },
                ],
        });
    
        const restaurantsFromMenus = menusByName.map((menu) => menu.restaurant);

        const combinedResults = [...restaurantsByName, ...restaurantsFromMenus];
        const uniqueResults = Array.from(
            new Map(combinedResults.map((restaurant) => [restaurant.id, restaurant]))
        ).map(([, restaurant]) => restaurant);
        return uniqueResults;
    } catch (error) {
      throw new Error(`Error searching restaurants: ${error.message}`);
    }
};

exports.getRestaurantDetails = async (restaurantId) => {
    try {
      const restaurant = await Restaurant.findOne({
        where: { id: restaurantId },
        include: [
          {
            model: Menu,
            as: 'menus',
            attributes: ['id', 'name', 'description', 'price'],
          },
        ],
      });
  
      return restaurant;
    } catch (error) {
      throw new Error(`Error fetching restaurant details: ${error.message}`);
    }
};