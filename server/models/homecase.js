'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeCase = sequelize.define('HomeCase', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    casenumberId: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    projectId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    statusId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    units: {
      allowNull: false,
      type: DataTypes.STRING
    },
    owner: {
      allowNull: false,
      type: DataTypes.STRING
    },
    phoneOwner: {
      allowNull: false,
      type: DataTypes.STRING
    },
    checkInDate: {
      allowNull: false,
      type: DataTypes.DATE
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
  HomeCase.associate = function (models) {
    // associations can be defined here
    HomeCase.belongsTo(models.HomeCaseDet, {
      foreignKey: 'id',
      targetKey: 'caseId'
    })
    HomeCase.hasMany(models.HomeProj, {
      foreignKey: 'id',
      targetKey: 'projectId'
    })
    HomeCase.hasMany(models.HomeStatus, {
      foreignKey: 'id',
      targetKey: 'statusId'
    })
  };
  return HomeCase;
};
