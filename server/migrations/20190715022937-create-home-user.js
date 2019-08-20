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
        type: Sequelize.STRING,
        unique: true
      },
      firstname: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      hashPwd: {
        type: Sequelize.STRING
      },
      loginToken: {
        type: Sequelize.STRING
      },
      verifyToken: {
        type: Sequelize.STRING
      },
      userExpiredAt: {
        type: Sequelize.DATE
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
      role: {
        type: Sequelize.INTEGER,
      },
      visible: {
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