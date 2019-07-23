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
        type: Sequelize.INTEGER,
        unique: true
      },
      projectId: {
        type: Sequelize.UUID,
      },
      catId: {
        type: Sequelize.UUID
      },
      subcatId: {
        type: Sequelize.UUID
      },
      statusId: {
        type: Sequelize.UUID
      },
      units: {
        type: Sequelize.STRING
      },
      issuerName: {
        type: Sequelize.STRING
      },
      homecareName: {
        type: Sequelize.STRING
      },
      homecareInDate: {
        type: Sequelize.DATE
      },
      createdBy: {
        type: Sequelize.UUID
      },
      updatedBy: {
        type: Sequelize.UUID
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      deletedAt: {
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