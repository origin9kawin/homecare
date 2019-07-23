'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeImgSubTag = sequelize.define('HomeImgSubTag', {

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
    mainimgtagId: {
      // 
      allowNull: true,
      type: DataTypes.UUID
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
  HomeImgSubTag.associate = function (models) {

    HomeImgSubTag.belongsTo(models.HomeImgMainTag)
    HomeImgSubTag.hasMany(models.HomeImgMainTag, {
      foreignKey: 'mainimgtagId',
      as: 'xHomeImgMainTag'
    })
    // -------------------------- above this line is done try to not modify

  };
  return HomeImgSubTag;
};
