'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeImgSubTag = sequelize.define('HomeImgSubTag', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    color: {
      type: DataTypes.STRING
    },
    mainimgtagId: {
      type: DataTypes.UUID
    },
    ordering: {
      type: DataTypes.INTEGER
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
  HomeImgSubTag.associate = function (models) {
    HomeImgSubTag.belongsTo(models.HomeImgMainTag)
    HomeImgSubTag.hasMany(models.HomeImgMainTag, {
      foreignKey: 'mainimgtagId',
      as: 'xHomeImgMainTag'
    })
    HomeImgSubTag.belongsTo(models.HomeImage)
  };
  return HomeImgSubTag;
};
