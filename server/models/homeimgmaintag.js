'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeImgMainTag = sequelize.define('HomeImgMainTag', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    name: {
      type: DataTypes.STRING,
    },
    color: {
      type: DataTypes.STRING
    },
    ordering: {
      type: DataTypes.INTEGER,
    },
    selectAble: {
      type: DataTypes.BOOLEAN,
    },
    createdBy: {
      type: DataTypes.STRING
    },
    updatedBy: {
      type: DataTypes.STRING
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
  HomeImgMainTag.associate = function (models) {
    HomeImgMainTag.belongsTo(models.HomeImage)
    HomeImgMainTag.belongsTo(models.HomeImgSubTag)
    HomeImgMainTag.hasMany(models.HomeImgSubTag, {
      foreignKey: 'mainimgtagId',
      sourceKey: 'id',
      as: 'xHomeImgSubTag'
    })
  };
  return HomeImgMainTag;
};