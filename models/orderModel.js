module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        total_amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('Pending', 'Completed', 'Cancelled'),
            defaultValue: 'Pending',
        }
    }, {
      timestamps: true,
      tableName: 'orders',
      createdAt: 'createdat',
      updatedAt: 'updatedat',
    });
  
    return Order;
  };
  