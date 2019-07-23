'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeCaseDet = sequelize.define('HomeCaseDet', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      // defaultValue: DataTypes.UUIDV4,
    },
    caseId: {
      type: DataTypes.UUID
    },
    statusId: {
      type: DataTypes.UUID
    },
    catId: {
      type: DataTypes.UUID
    },
    subcatId: {
      type: DataTypes.UUID
    },
    someLost: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    whatLost: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT
    },
    checkInDate: {
      type: DataTypes.DATE
    },
    checkDetail: {
      type: DataTypes.STRING
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
    remark: {
      type: DataTypes.STRING
    },
    slaDay: {
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
  HomeCaseDet.associate = function (models) {

    HomeCaseDet.belongsTo(models.HomeCase)
    HomeCaseDet.hasMany(models.HomeImage, {
      foreignKey: 'casedetId',
      sourceKey: 'id',
      as: 'xHomeImage'
    })
    // -------------------------- above this line is done try to not modify

    // HomeCaseDet.hasOne(models.HomeCate, {
    //   foreignKey: 'catId',
    //   // targetKey: 'id'
    // })
    // HomeCaseDet.hasOne(models.HomeSubCat, {
    //   foreignKey: 'subcatId',
    //   // targetKey: 'id'
    // })
    // HomeCaseDet.hasOne(models.HomeStatus, {
    //   foreignKey: 'statusId',
    //   // targetKey: 'id'
    // })
    // HomeCaseDet.hasOne(models.HomeReason, {
    //   foreignKey: 'reasonId',
    //   // targetKey: 'id'
    // })
    HomeCaseDet.hasMany(models.HomeListDefect, {
      foreignKey: 'casedetId',
      // as: 'bbb',
      // as: 'defectlist'

    })


  };
  return HomeCaseDet;
};
