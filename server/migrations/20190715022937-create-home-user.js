'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('HomeUsers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      firstname: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      hashPwd: {
        allowNull: false,
        type: Sequelize.STRING
      },
      loginToken: {
        type: Sequelize.STRING
      },
      verifyToken: {
        type: Sequelize.STRING
      },
      userExpiredAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdBy: {
        type: Sequelize.UUID
      },
      updatedBy: {
        type: Sequelize.UUID
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      deletedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      visible: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      genTestTextPwd: {
        type: Sequelize.STRING
      },

    }, {
        freezeTableName: true,
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('HomeUsers');
  }
};