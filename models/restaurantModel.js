module.exports = (sequelize, DataTypes) => {
    const Restaurant = sequelize.define('Restaurant', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cuisine: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        rating: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
    }, {
        tableName: 'restaurants',
        timestamps: true,
        createdAt: 'createdat',
        updatedAt: 'updatedat',
    });
  
    return Restaurant;
  };
  