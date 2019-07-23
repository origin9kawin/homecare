'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('HomeImages', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      casedetId: {
        allowNull: false,
        type: Sequelize.UUID
      },
      mainimgtagId: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      subimgtagId: {
        allowNull: true,
        type: Sequelize.UUID,
      },
      fileName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      fileType: {
        allowNull: false,
        type: Sequelize.STRING
      },
      fileSize: {
        allowNull: false,
        type: Sequelize.INTEGER
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
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('HomeImages');
  }
};