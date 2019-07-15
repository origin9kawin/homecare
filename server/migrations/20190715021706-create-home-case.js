'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('HomeCases', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      casenumberId: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      projectId: {
        allowNull: false,
        type: Sequelize.UUID
      },
      statusId: {
        allowNull: false,
        type: Sequelize.UUID
      },
      units: {
        allowNull: false,
        type: Sequelize.STRING
      },
      owner: {
        allowNull: false,
        type: Sequelize.STRING
      },
      phoneOwner: {
        allowNull: false,
        type: Sequelize.STRING
      },
      checkInDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdBy: {
        allowNull: false,
        type: Sequelize.UUID
      },
      updatedBy: {
        allowNull: true,
        type: Sequelize.UUID
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('HomeCases');
  }
};