'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('HomeUser', {
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
        allowNull: true,
        type: Sequelize.STRING
      },
      verifyToken: {
        allowNull: true,
        type: Sequelize.STRING
      },
      userExpiredAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdBy: {
        allowNull: true,
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
      visible: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    }, {
        freezeTableName: true,
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('HomeUsers');
  }
};