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
      caseId: {
        type: Sequelize.UUID
      },
      casedetId: {
        type: Sequelize.UUID
      },
      statusId: {
        type: Sequelize.UUID
      },
      mainimgtagId: {
        type: Sequelize.UUID,
      },
      subimgtagId: {
        type: Sequelize.UUID,
      },
      fileName: {
        type: Sequelize.STRING
      },
      fileType: {
        type: Sequelize.STRING
      },
      fileSize: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('HomeImages');
  }
};