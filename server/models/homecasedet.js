'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeCaseDet = sequelize.define('HomeCaseDet', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    caseId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    catId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    subcatId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    statusId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    reasonId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    homecareName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    homecareInDate: {
      allowNull: false,
      type: DataTypes.DATE
    },
    checkDetail: {
      allowNull: false,
      type: DataTypes.STRING
    },
    singOwner: {
      allowNull: false,
      type: DataTypes.STRING
    },
    listDefect: {
      allowNull: false,
      type: DataTypes.STRING
    },
    remark: {
      allowNull: false,
      type: DataTypes.STRING
    },
    slaDay: {
      allowNull: false,
      type: DataTypes.INTEGER
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
  HomeCaseDet.associate = function (models) {
    // associations can be defined here
    HomeCaseDet.belongsTo(models.HomeImage, {
      foreignKey: 'id',
      targetKey: 'casedetId'
    })
    HomeCaseDet.hasMany(models.HomeCase, {
      foreignKey: 'id',
      targetKey: 'caseId'
    })
    HomeCaseDet.hasMany(models.HomeCate, {
      foreignKey: 'id',
      targetKey: 'caseId'
    })
    HomeCaseDet.hasMany(models.HomeSubCat, {
      foreignKey: 'id',
      targetKey: 'subcatId'
    })
    HomeCaseDet.hasMany(models.HomeStatus, {
      foreignKey: 'id',
      targetKey: 'statusId'
    })
    HomeCaseDet.hasMany(models.HomeReason, {
      foreignKey: 'id',
      targetKey: 'reasonId'
    })
  };
  return HomeCaseDet;
};
