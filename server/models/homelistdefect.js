'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeListDefect = sequelize.define('HomeListDefect', {

    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      // defaultValue: DataTypes.UUIDV4
    },
    caseId: {
      type: DataTypes.UUID
    },
    casedetId: {
      type: DataTypes.UUID
    },
    name: {
      type: DataTypes.STRING
    },
    color: {
      type: DataTypes.STRING
    },
    createdBy: {
      type: DataTypes.UUID
    },
    createdAt: {
      allowNull: false,
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
  HomeListDefect.associate = function (models) {
    // associations can be defined here
    // HomeListDefect.belongsTo(models.HomeCaseDet, {
    //   foreignKey: 'casedetId'
    // })
    // HomeListDefect.belongsTo(models.HomeCase, {
    //   foreignKey: 'caseId'
    // })

  };
  return HomeListDefect;
};