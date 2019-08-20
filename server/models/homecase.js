'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeCase = sequelize.define('HomeCase', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    casenumberId: {
      allowNull: true,
      type: DataTypes.INTEGER,
      unique: true
    },
    projectId: {
      allowNull: true,
      type: DataTypes.UUID
    },
    catId: {
      allowNull: true,
      type: DataTypes.UUID
    },
    subcatId: {
      allowNull: true,
      type: DataTypes.UUID
    },
    statusId: {
      allowNull: true,
      type: DataTypes.UUID
    },
    units: {
      allowNull: true,
      type: DataTypes.STRING
    },
    issuerName: {
      type: DataTypes.STRING
    },
    homecareName: {
      type: DataTypes.STRING
    },
    homecareInDate: {
      type: DataTypes.DATE
    },
    someLost: {
      type: DataTypes.BOOLEAN,
    },
    whatLost: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT
    },
    receiverSignName: {
      type: DataTypes.STRING
    },
    receiverSignImage: {
      type: DataTypes.UUID
    },
    receiverSignChatImage: {
      type: DataTypes.UUID
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
  HomeCase.associate = function (models) {

    HomeCase.belongsTo(models.HomeProj)
    HomeCase.belongsTo(models.HomeCaseDet)
    HomeCase.belongsTo(models.HomeStatus)
    HomeCase.hasOne(models.HomeStatus, {
      as: 'xHomeStatus',
      foreignKey: 'id',
      sourceKey: 'statusId',
    })
    HomeCase.hasMany(models.HomeCaseDet, {
      foreignKey: 'caseId',
      sourceKey: 'id',
      as: 'xHomeCaseDet'
    })
    HomeCase.hasOne(models.HomeCate, {
      as: 'xHomeCate',
      foreignKey: 'id',
      sourceKey: 'catId',
    })
    HomeCase.hasOne(models.HomeSubCat, {
      as: 'xHomeSubCat',
      foreignKey: 'id',
      sourceKey: 'subcatId',
    })
    HomeCase.hasMany(models.HomePhone, {
      sourceKey: 'id',
      foreignKey: 'caseId',
      as: 'xHomePhone_Issuer',
    })
    HomeCase.hasMany(models.HomePhone, {
      foreignKey: 'caseId',
      as: 'xHomePhone_Owner',
    })
    HomeCase.hasMany(models.HomeImage, {
      foreignKey: 'caseId',
      sourceKey: 'id',
      as: 'xHomeImage'
    })
    HomeCase.hasMany(models.HomeListDefect, {
      foreignKey: 'caseId',
      sourceKey: 'id',
      as: 'xHomeListDefect'
    })
  };
  return HomeCase;
};
