'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeProj = sequelize.define('HomeProj', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      // defaultValue: DataTypes.UUIDV4,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    color: {
      allowNull: true,
      type: DataTypes.STRING
    },
    // initState: {
    //   allowNull: true,
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: false
    // },
    createdBy: {
      allowNull: false,
      type: DataTypes.UUID
    },
    updatedBy: {
      allowNull: true,
      type: DataTypes.UUID
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
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
  HomeProj.associate = function (models) {

    HomeProj.hasMany(models.HomeCase, {
      as: 'xHomeCase',
      foreignKey: 'projectId',
      sourceKey: 'id'
    })
    // -------------------------- above this line is done try to not modify

    // HomeProj.belongsTo(models.HomeCase)

    //   foreignKey: 'id',
    //   sourceKey: 'caseId',
    //   as: 'case_proj_asso'
    // })


  };
  return HomeProj;
};