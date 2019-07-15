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
        allowNull: false,
        type: Sequelize.UUID
      },
      catId: {
        allowNull: false,
        type: Sequelize.UUID
      },
      subcatId: {
        allowNull: false,
        type: Sequelize.UUID
      },
      statusId: {
        allowNull: false,
        type: Sequelize.UUID
      },
      reasonId: {
        allowNull: false,
        type: Sequelize.UUID
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      homecareName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      homecareInDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      checkDetail: {
        allowNull: false,
        type: Sequelize.STRING
      },
      singOwner: {
        allowNull: false,
        type: Sequelize.STRING
      },
      listDefect: {
        allowNull: false,
        type: Sequelize.STRING
      },
      remark: {
        allowNull: false,
        type: Sequelize.STRING
      },
      slaDay: {
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
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('HomeCaseDets');
  }
};