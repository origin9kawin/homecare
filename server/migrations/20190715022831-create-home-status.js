'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('HomeStatus', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      desc: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      color: {
        allowNull: false,
        type: Sequelize.STRING
      },
      initState: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      filterAble: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      selectAble: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      reasonBtn: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      ordering: {
        type: Sequelize.INTEGER
      },
      createdBy: {
        allowNull: false,
        type: Sequelize.UUID
      },
      updatedBy: {
        type: Sequelize.UUID
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      }

    }, {
        freezeTableName: true,
        timestamps: false,
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('HomeStatus');
  }
};