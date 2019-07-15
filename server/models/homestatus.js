'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeStatus = sequelize.define('HomeStatus', {
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
    color: {
      allowNull: false,
      type: DataTypes.STRING
    },
    createdBy: {
      allowNull: false,
      type: DataTypes.STRING
    },
    updatedBy: {
      allowNull: true,
      type: DataTypes.STRING
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE
    }
  }, {
      freezeTableName: true,
    });
  HomeStatus.associate = function (models) {
    HomeStatus.belongsTo(models.HomeCase, {
      foreignKey: 'id',
      targetKey: 'statusId'
    })
    HomeStatus.belongsTo(models.HomeCaseDet, {
      foreignKey: 'id',
      targetKey: 'statusId'
    })
  };
  return HomeStatus;
};