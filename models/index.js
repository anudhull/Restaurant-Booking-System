const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const RestaurantModel = require('./restaurantModel')(sequelize, DataTypes);
const MenuModel = require('./menuModel')(sequelize, DataTypes);
const CartModel = require('./cartModel')(sequelize, DataTypes);
const OrderModel = require('./orderModel')(sequelize, DataTypes);
const OrderItemsModel = require('./orderItemsModel')(sequelize, DataTypes);
const userModel = require('./userModel')(sequelize, DataTypes);

RestaurantModel.hasMany(MenuModel, { foreignKey: 'restaurantId', as: 'menus' });
MenuModel.belongsTo(RestaurantModel, { foreignKey: 'restaurantId', as: 'restaurant' });

CartModel.belongsTo(MenuModel, { foreignKey: 'item_id', as: 'menus' });
MenuModel.hasMany(CartModel, { foreignKey: 'item_id', as: 'carts' });

MenuModel.belongsToMany(OrderModel, {
  through: OrderItemsModel,
  foreignKey: 'item_id',
  otherKey: 'order_id',
  as: 'orders',
});

OrderModel.hasMany(OrderItemsModel, { foreignKey: 'order_id', as: 'items' });
OrderItemsModel.belongsTo(OrderModel, { foreignKey: 'order_id', as: 'order' });
OrderItemsModel.belongsTo(MenuModel, { foreignKey: 'menu_id', as: 'menu' });

OrderModel.belongsTo(userModel, { foreignKey: 'user_id', as: 'user' });
userModel.hasMany(OrderModel, { foreignKey: 'user_id', as: 'orders' });

module.exports = {
  sequelize,
  Restaurant: RestaurantModel,
  Menu: MenuModel,
  Cart: CartModel,
  Order: OrderModel,
  OrderItems: OrderItemsModel,
  User: userModel,
};
