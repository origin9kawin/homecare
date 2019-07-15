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
    return queryInterface.bulkInsert('HomeProjs', [{
      id: uuidv4(),
      name: 'เคนซิงตัน สุขุมวิท-เทพารักษ์',
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
