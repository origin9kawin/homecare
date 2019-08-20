'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeReasonDet = sequelize.define('HomeReasonDet', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    caseId: {
      type: DataTypes.UUID
    },
    casedetId: {
      type: DataTypes.UUID
    },
    statusId: {
      type: DataTypes.UUID
    },
    reasonId: {
      type: DataTypes.UUID
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
    }
  }, {
      timestamps: false
    });
  HomeReasonDet.associate = function (models) {
    HomeReasonDet.belongsTo(models.HomeCaseDet);
  };
  return HomeReasonDet;
};