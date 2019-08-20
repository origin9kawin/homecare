'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeUser = sequelize.define('HomeUser', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      type: DataTypes.STRING,
      unique: true
    },
    firstname: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    hashPwd: {
      type: DataTypes.STRING
    },
    loginToken: {
      type: DataTypes.STRING
    },
    verifyToken: {
      type: DataTypes.STRING
    },
    userExpiredAt: {
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
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
    role: {
      type: DataTypes.INTEGER,
    },
    visible: {
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