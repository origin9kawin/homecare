'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeStatus = sequelize.define('HomeStatus', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      // defaultValue: DataTypes.UUIDV4,
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
    initState: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    }

  }, {
      freezeTableName: true,
    });
  HomeStatus.associate = function (models) {
    // // slave
    // HomeStatus.belongsTo(models.HomeCaseDet, {
    //   foreignKey: 'caseId',
    // })
    // // HomeStatus.belongsTo(models.HomeCase)
    // // master
    // HomeStatus.belongsTo(models.HomeCase)

  };
  return HomeStatus;
};