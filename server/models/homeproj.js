'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeProj = sequelize.define('HomeProj', {
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
      allowNull: true,
      type: DataTypes.STRING
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
  HomeProj.associate = function (models) {
    HomeProj.belongsTo(models.HomeCase, {
      foreignKey: 'id',
      targetKey: 'projectId'
    })
  };
  return HomeProj;
};