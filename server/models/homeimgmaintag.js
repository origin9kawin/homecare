'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeImgMainTag = sequelize.define('HomeImgMainTag', {

    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      // defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    color: {
      type: DataTypes.STRING
    },
    ordering: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    createdBy: {
      type: DataTypes.STRING
    },
    updatedBy: {
      allowNull: true,
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
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


  }, {});
  HomeImgMainTag.associate = function (models) {

    HomeImgMainTag.belongsTo(models.HomeImage)
    HomeImgMainTag.belongsTo(models.HomeImgSubTag)
    // -------------------------- above this line is done try to not modify
    HomeImgMainTag.hasMany(models.HomeImgSubTag, {
      foreignKey: 'mainimgtagId',
      sourceKey: 'id',
      as: 'xHomeImgSubTag'
    })
  };
  return HomeImgMainTag;
};