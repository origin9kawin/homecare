'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeReason = sequelize.define('HomeReason', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    color: {
      type: DataTypes.STRING
    },
    ordering: {
      type: DataTypes.INTEGER
    },
    createdBy: {
      type: DataTypes.UUID
    },
    updatedBy: {
      type: DataTypes.UUID
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    }
  }, {
      timestamps: false
    });
  HomeReason.associate = function (models) {
    HomeReason.belongsTo(models.HomeCaseDet, {
      foreignKey: 'reasonId',
    })
  };
  return HomeReason;
};