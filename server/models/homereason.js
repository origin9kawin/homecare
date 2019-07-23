'use strict';
module.exports = (sequelize, DataTypes) => {
  const HomeReason = sequelize.define('HomeReason', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    color: {
      allowNull: false,
      type: DataTypes.STRING
    },
    initState: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
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
  HomeReason.associate = function (models) {
    HomeReason.belongsTo(models.HomeCaseDet, {
      foreignKey: 'reasonId',
      // targetKey: 'id'
    })
  };
  return HomeReason;
};