'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeListDefect = sequelize.define('HomeListDefect', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    caseId: {
      type: DataTypes.UUID
    },
    casedetId: {
      type: DataTypes.UUID
    },
    name: {
      type: DataTypes.STRING
    },
    remark: {
      type: DataTypes.STRING
    },
    color: {
      type: DataTypes.STRING
    },
    createdBy: {
      type: DataTypes.UUID
    },
    updatedBy: {
      type: DataTypes.UUID,
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
  HomeListDefect.associate = function (models) {
    HomeListDefect.belongsTo(models.HomeCaseDet);
    HomeListDefect.hasMany(models.HomeCaseDet, {
      as: 'xHomeCaseDet',
      sourceKey: 'casedetId',
      foreignKey: 'id'
    })
  };
  return HomeListDefect;
};