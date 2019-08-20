'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeCaseDet = sequelize.define('HomeCaseDet', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
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
    assignedTo: {
      type: DataTypes.UUID,
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
  HomeCaseDet.associate = function (models) {
    HomeCaseDet.belongsTo(models.HomeListDefect);
    HomeCaseDet.belongsTo(models.HomeCase);
    HomeCaseDet.hasMany(models.HomeImage, {
      foreignKey: 'casedetId',
      sourceKey: 'id',
      as: 'xHomeImage'
    })
    HomeCaseDet.hasMany(models.HomeListDefect, {
      foreignKey: 'casedetId',
      sourceKey: 'id',
      as: 'xHomeListDefect'
    })
    HomeCaseDet.hasMany(models.HomePhone, {
      foreignKey: 'caseId',
      sourceKey: 'caseId',
      as: 'xHomePhone_Owner'
    })
    HomeCaseDet.hasMany(models.HomePhone, {
      foreignKey: 'caseId',
      sourceKey: 'caseId',
      as: 'xHomePhone_Issuer'
    })
    HomeCaseDet.hasMany(models.HomeCase, {
      as: 'xHomeCase',
      sourceKey: 'caseId',
      foreignKey: 'id'
    })
    HomeCaseDet.hasMany(models.HomeStatus, {
      foreignKey: 'id',
      sourceKey: 'statusId',
      as: 'xHomeStatus'
    })
    HomeCaseDet.hasMany(models.HomeReasonDet, {
      as: 'xHomeReasonDet',
      sourceKey: 'id',
      foreignKey: 'casedetid',
    })
    // -------------------------- above this line is done try to not modify
  };
  return HomeCaseDet;
};
