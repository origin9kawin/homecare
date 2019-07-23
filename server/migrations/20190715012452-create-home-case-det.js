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
      someLost: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      whatLost: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      checkInDate: {
        type: Sequelize.DATE
      },
      checkDetail: {
        type: Sequelize.STRING
      },
      receiverSignName: {
        type: Sequelize.STRING
      },
      receiverSignImage: {
        type: Sequelize.UUID
      },
      receiverSignChatImage: {
        type: Sequelize.UUID
      },
      remark: {
        type: Sequelize.STRING
      },
      slaDay: {
        type: Sequelize.INTEGER
      },
      createdBy: {
        type: Sequelize.UUID
      },
      updatedBy: {
        type: Sequelize.UUID
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      deletedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('HomeCaseDets');
  }
};