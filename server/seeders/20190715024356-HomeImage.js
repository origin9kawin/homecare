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
    return queryInterface.bulkInsert('HomeImages', [{
      id: uuidv4(),
      casedetId: '9a4a062e-b802-43a0-808d-e9ba99ceccbb',
      fileName: 'a.jpg',
      fileType: 'jpeg',
      fileSize: '15000',
      createdBy: '323fdba0-a3d8-11e9-9d13-b1bc66139611',
      updatedBy: '323fdba0-a3d8-11e9-9d13-b1bc66139611',
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
