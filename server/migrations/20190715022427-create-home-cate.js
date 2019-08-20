'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('HomeCates', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      name: {
        type: Sequelize.STRING,
      },
      color: {
        type: Sequelize.STRING,
      },
      slaDay: {
        type: Sequelize.INTEGER,
      },
      createdBy: {
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
        timestamps: false
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('HomeCates');
  }
};