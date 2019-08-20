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
        allowNull: true,
        type: Sequelize.INTEGER,
        unique: true
      },
      projectId: {
        allowNull: true,
        type: Sequelize.UUID
      },
      catId: {
        allowNull: true,
        type: Sequelize.UUID
      },
      subcatId: {
        allowNull: true,
        type: Sequelize.UUID
      },
      statusId: {
        allowNull: true,
        type: Sequelize.UUID
      },
      units: {
        allowNull: true,
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
      someLost: {
        type: Sequelize.BOOLEAN,
      },
      whatLost: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
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
    return queryInterface.dropTable('HomeCases');
  }
};