'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeProj = sequelize.define('HomeProj', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
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
  HomeProj.associate = function (models) {
    HomeProj.hasMany(models.HomeCase, {
      as: 'xHomeCase',
      foreignKey: 'projectId',
      sourceKey: 'id'
    })
    // -------------------------- above this line is done try to not modify
  };
  return HomeProj;
};