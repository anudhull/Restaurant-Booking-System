module.exports = (sequelize, DataTypes) => {
    const Menu = sequelize.define('Menu', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        restaurant_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'restaurants',
              key: 'id',
            },
          },
    }, {
      timestamps: true,
      tableName: 'menus',
      createdAt: 'createdat',
      updatedAt: 'updatedat',
      underscored: true,
    });

    return Menu;
  };
  