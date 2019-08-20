'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('HomeListDefects', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      caseId: {
        type: Sequelize.UUID
      },
      casedetId: {
        type: Sequelize.UUID
      },
      name: {
        type: Sequelize.STRING
      },
      remark: {
        type: Sequelize.STRING
      },
      color: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('HomeListDefects');
  }
};