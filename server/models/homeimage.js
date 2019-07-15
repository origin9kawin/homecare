'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeImage = sequelize.define('HomeImage', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    casedetId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    fileName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    fileType: {
      allowNull: false,
      type: DataTypes.STRING
    },
    fileSize: {
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
  HomeImage.associate = function (models) {
    HomeImage.hasMany(models.HomeCaseDet, {
      foreignKey: 'id',
      targetkey: 'casedetId',
    });
  };
  return HomeImage;
};