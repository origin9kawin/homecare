'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeCate = sequelize.define('HomeCate', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    name: {
      type: DataTypes.STRING,
    },
    color: {
      type: DataTypes.STRING,
    },
    slaDay: {
      type: DataTypes.INTEGER,
    },
    createdBy: {
      type: DataTypes.UUID
    },
    updatedBy: {
      type: DataTypes.UUID
    },
    createdAt: {
      type: DataTypes.DATE,
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
  HomeCate.associate = function (models) {
    HomeCate.belongsTo(models.HomeSubCat)
  };
  return HomeCate;
};