'use strict';

const uuidv4 = require('uuid/v4');

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('HomeCases', [{
      id: uuidv4(),
      casenumberId: '123456786',
      projectId: '36a32295-a6f3-489c-b8db-949004477d8a',
      statusId: 'c7008189-84da-456d-99e5-ed19d91b0c3f',
      units: 'A3302',
      owner: "นันทิกานต์ ปุญญานันท์",
      checkInDate: new Date(),
      phoneOwner: '098-112-3422',
      createdBy: '323fdba0-a3d8-11e9-9d13-b1bc66139611',
      updatedBy: null,
      createdAt: new Date(),
      updatedAt: new Date()
    },

    ], {})

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
