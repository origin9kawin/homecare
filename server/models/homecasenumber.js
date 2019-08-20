'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeCaseNumber = sequelize.define('HomeCaseNumber', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    createdBy: {
      type: DataTypes.UUID,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  }, {
      timestamp: false
    });
  HomeCaseNumber.associate = function (models) {
    // associations can be defined here
  };
  return HomeCaseNumber;
};