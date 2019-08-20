'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeStatus = sequelize.define('HomeStatus', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    desc: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    color: {
      type: DataTypes.STRING
    },
    initState: {
      type: DataTypes.BOOLEAN,
    },
    filterAble: {
      type: DataTypes.BOOLEAN,
    },
    selectAble: {
      type: DataTypes.BOOLEAN,
    },
    reasonBtn: {
      type: DataTypes.BOOLEAN,
    },
    ordering: {
      type: DataTypes.INTEGER
    },
    createdBy: {
      type: DataTypes.STRING
    },
    updatedBy: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    }
  }, {
      freezeTableName: true,
      timestamps: false
    });
  HomeStatus.associate = function (models) {
    HomeStatus.hasMany(models.HomeCase, {
      foreignKey: 'statusId',
      sourceKey: 'id',
      as: 'xHomeCase'
    })
    HomeStatus.belongsTo(models.HomeCaseDet)
    // -------------------------- above this line is done try to not modify
  };
  return HomeStatus;
};