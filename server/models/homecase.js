'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeCase = sequelize.define('HomeCase', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      // defaultValue: DataTypes.UUIDV4,
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
    createdBy: {
      type: DataTypes.UUID
    },
    updatedBy: {
      type: DataTypes.UUID
    },
    createdAt: {
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
  HomeCase.associate = function (models) {

    HomeCase.belongsTo(models.HomeProj)
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
      foreignKey: 'caseId',
      as: 'xHomePhone_Issuer',
    })
    HomeCase.hasMany(models.HomePhone, {
      foreignKey: 'caseId',
      as: 'xHomePhone_Owner',
    })
    // -------------------------- above this line is done modify it if


    // HomeCase.hasMany(models.HomePhone, {
    //   foreignKey: 'caseId',
    //   as: 'issuer_phone',
    // })
    // HomeCase.hasMany(models.HomePhone, {
    //   foreignKey: 'caseId',
    //   as: 'owner_phone',
    // })
    HomeCase.hasMany(models.HomeListDefect, {
      foreignKey: 'caseId',
      as: 'defectlist',
    })

    // slave
    // HomeCase.hasOne(models.HomeProj, {
    //   foreignKey: 'id',
    //   sourceKey: 'projectId',
    //   as: 'project_asso'
    // })



  };
  return HomeCase;
};
