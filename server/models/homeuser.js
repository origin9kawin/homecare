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
      type: DataTypes.STRING
    },
    verifyToken: {
      type: DataTypes.STRING
    },
    userExpiredAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    createdBy: {
      type: DataTypes.UUID
    },
    updatedBy: {
      type: DataTypes.UUID
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
    visible: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    genTestTextPwd: {
      type: DataTypes.STRING
    },

  }, {
      freezeTableName: false,
    });
  HomeUser.associate = function (models) {

  };
  return HomeUser;
};