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
      type: DataTypes.UUID
    },
    mainimgtagId: {
      type: DataTypes.UUID,
    },
    subimgtagId: {
      type: DataTypes.UUID,
    },
    fileName: {
      type: DataTypes.STRING
    },
    fileType: {
      type: DataTypes.STRING
    },
    fileSize: {
      type: DataTypes.INTEGER
    },
    createdBy: {
      type: DataTypes.UUID
    },
    updatedBy: {
      type: DataTypes.UUID
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
  HomeImage.associate = function (models) {

    HomeImage.belongsTo(models.HomeCaseDet);
    HomeImage.hasMany(models.HomeImgMainTag, {
      foreignKey: 'id',
      sourceKey: 'mainimgtagId',
      as: 'xHomeImgMainTag'
    })
    // -------------------------- above this line is done try to not modify
    // HomeImgMainTag.hasMany(models.HomeImgSubTag, {
    //   foreignKey: 'mainimgtagId',
    //   as: 'xHomeImgSubTag'
    // })

    // HomeImage.hasOne(models.HomeImgSubTag, {
    //   foreignKey: 'subimgtagId'
    // })

  };
  return HomeImage;
};