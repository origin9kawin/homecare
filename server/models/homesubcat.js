'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeSubCat = sequelize.define('HomeSubCat', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    catId: {
      // allowNull: false,
      type: DataTypes.UUID
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
  HomeSubCat.associate = function (models) {
    // associations can be defined here
    HomeSubCat.hasMany(models.HomeCate, {
      foreignKey: 'id',
      targetKey: 'catId'
    })
    HomeSubCat.belongsTo(models.HomeCaseDet, {
      foreignKey: 'id',
      targetKey: 'subcatId'
    })
  };
  return HomeSubCat;
};