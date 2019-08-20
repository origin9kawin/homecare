'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeSubCat = sequelize.define('HomeSubCat', {
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
    maincatId: {
      type: DataTypes.UUID
    },
    slaDay: {
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
    },
  }, {});
  HomeSubCat.associate = function (models) {
    HomeSubCat.belongsTo(models.HomeCase)
    HomeSubCat.hasMany(models.HomeCate, {
      foreignKey: 'maincatId',
      sourceKey: 'id',
      as: 'xHomeCat'
    })
    // -------------------------- above this line is done try to not modify
  };
  return HomeSubCat;
};