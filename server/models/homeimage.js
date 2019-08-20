'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeImage = sequelize.define('HomeImage', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
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
  HomeImage.associate = function (models) {
    HomeImage.belongsTo(models.HomeCase);
    HomeImage.belongsTo(models.HomeCaseDet);
    HomeImage.hasMany(models.HomeImgMainTag, {
      foreignKey: 'id',
      sourceKey: 'mainimgtagId',
      as: 'xHomeImgMainTag'
    })
    HomeImage.hasMany(models.HomeImgSubTag, {
      foreignKey: 'id',
      sourceKey: 'subimgtagId',
      as: 'xHomeImgSubTag'
    })
  };
  return HomeImage;
};