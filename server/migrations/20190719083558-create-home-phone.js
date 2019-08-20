'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('HomePhones', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      number: {
        type: Sequelize.STRING,
      },
      color: {
        type: Sequelize.STRING
      },
      caseId: {
        type: Sequelize.UUID
      },
      homecareOwner: {
        type: Sequelize.BOOLEAN
      },
      createdBy: {
        type: Sequelize.STRING
      },
      updatedBy: {
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE
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
    return queryInterface.dropTable('HomePhones');
  }
};