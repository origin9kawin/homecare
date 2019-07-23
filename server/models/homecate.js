'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeCate = sequelize.define('HomeCate', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      // defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      // unique: true
    },
    color: {
      type: DataTypes.STRING,
    },
    createdBy: {
      type: DataTypes.UUID
    },
    updatedBy: {
      type: DataTypes.UUID
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    deletedAt: {
      type: DataTypes.DATE,
    }

  }, {});
  HomeCate.associate = function (models) {

    // -------------------------- above this line is done try to not modify
    // HomeCate.belongsTo(models.HomeCase)

    HomeCate.belongsTo(models.HomeSubCat)
    // HomeCate.hasMany(models.HomeSubCat, {
    //   foreignKey: 'maincatId',
    //   sourceKey: 'id',
    //   as: 'xHomeSubCat'
    // });


  };
  return HomeCate;
};