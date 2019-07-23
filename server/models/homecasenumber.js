'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeCaseNumber = sequelize.define('HomeCaseNumber', {



    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE
    }



  }, {

      timestamp: false

    });
  HomeCaseNumber.associate = function (models) {
    // associations can be defined here
  };
  return HomeCaseNumber;
};