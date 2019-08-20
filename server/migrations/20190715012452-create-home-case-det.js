'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('HomeCaseDets', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      caseId: {
        type: Sequelize.UUID
      },
      statusId: {
        type: Sequelize.UUID
      },
      catId: {
        type: Sequelize.UUID
      },
      subcatId: {
        type: Sequelize.UUID
      },
      assignedTo: {
        type: Sequelize.UUID
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
      },
    }, {
        timestamps: false
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('HomeCaseDets');
  }
};