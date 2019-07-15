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
    return queryInterface.bulkInsert('HomeSubCats', [{
      id: uuidv4(),
      name: 'ตู้รองเท้า',
      catId: '374f85d4-b981-4f81-9bb7-49ccfcfec99a',
      createdBy: '39c68f17-5ec0-435a-9038-749cc32279f7',
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
