'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('HomeCates', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        // defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        // unique: true
      },
      color: {
        type: Sequelize.STRING,
      },
      createdBy: {
        type: Sequelize.UUID
      },
      updatedBy: {
        type: Sequelize.UUID
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      deletedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('HomeCates');
  }
};