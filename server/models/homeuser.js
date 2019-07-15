'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeUser = sequelize.define('HomeUser', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      // defaultValue: DataTypes.UUIDV1,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    firstname: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    hashPwd: {
      allowNull: false,
      type: DataTypes.STRING
    },
    loginToken: {
      allowNull: true,
      type: DataTypes.STRING
    },
    verifyToken: {
      allowNull: true,
      type: DataTypes.STRING
    },
    userExpiredAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    createdBy: {
      allowNull: true,
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
    },
    visible: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
      freezeTableName: true,
    });
  HomeUser.associate = function (models) {

  };
  return HomeUser;
};