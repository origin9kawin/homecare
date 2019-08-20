'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('HomeImgSubTags', {

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
      mainimgtagId: {
        type: Sequelize.UUID
      },
      ordering: {
        type: Sequelize.INTEGER
      },
      selectAble: {
        type: Sequelize.BOOLEAN,
      },
      createdBy: {
        type: Sequelize.STRING
      },
      updatedBy: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('HomeImgSubTags');
  }
};