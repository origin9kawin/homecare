'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('HomeProjs', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        // defaultValue: Sequelize.UUIDV4,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      color: {
        type: Sequelize.STRING
      },
      // initState: {
      //   type: Sequelize.BOOLEAN,
      //   defaultValue: false
      // },
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
    return queryInterface.dropTable('HomeProjs');
  }
};