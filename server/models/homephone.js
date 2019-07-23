'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomePhone = sequelize.define('HomePhone', {

    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    number: {
      type: DataTypes.STRING,
    },
    color: {
      type: DataTypes.STRING
    },
    isMobile: {
      type: DataTypes.BOOLEAN,
    },
    caseId: {
      type: DataTypes.UUID
    },
    homecareOwner: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    createdBy: {
      type: DataTypes.STRING
    },
    updatedBy: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    deletedAt: {
      type: DataTypes.DATE,
    }



  }, {});


  HomePhone.associate = function (models) {

    HomePhone.belongsTo(models.HomeCase, {
      // foreignKey: 'caseId',
    })


  };
  return HomePhone;
};