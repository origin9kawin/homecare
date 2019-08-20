'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('HomeReasons', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        unique: true
      },
      color: {
        type: Sequelize.STRING
      },
      ordering: {
        type: Sequelize.INTEGER
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
        type: Sequelize.DATE
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
    return queryInterface.dropTable('HomeReasons');
  }
};