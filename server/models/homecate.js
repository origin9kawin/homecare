'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeCate = sequelize.define('HomeCate', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    createdBy: {
      allowNull: false,
      type: DataTypes.UUID
    },
    updatedBy: {
      allowNull: true,
      type: DataTypes.UUID
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }

  }, {});
  HomeCate.associate = function (models) {
    // associations can be defined here
    HomeCate.belongsTo(models.HomeSubCat, {
      foreignKey: 'id',
      targetKey: 'catId'
    });
  };
  return HomeCate;
};