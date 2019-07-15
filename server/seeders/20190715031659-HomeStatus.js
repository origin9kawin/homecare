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
    return queryInterface.bulkInsert('HomeStatus', [{
      id: uuidv4(),
      name: 'Hold-No workday',
      color: '#112233',
      createdBy: '39c68f17-5ec0-435a-9038-749cc32279f7',
      updatedBy: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuidv4(),
      name: 'Re-inprocess',
      color: '#223344',
      createdBy: '39c68f17-5ec0-435a-9038-749cc32279f7',
      updatedBy: null,
      createdAt: new Date(),
      updatedAt: new Date()

    }, {
      id: uuidv4(),
      name: 'Assign',
      color: '#334455',
      createdBy: '39c68f17-5ec0-435a-9038-749cc32279f7',
      updatedBy: '073e220c-7db7-48f5-a525-49c9ffec3e2d',
      createdAt: new Date(),
      updatedAt: new Date()

    }, {
      id: uuidv4(),
      name: 'Checking',
      color: '#445566',
      createdBy: '39c68f17-5ec0-435a-9038-749cc32279f7',
      updatedBy: null,
      createdAt: new Date(),
      updatedAt: new Date()

    }, {
      id: uuidv4(),
      name: 'Inprocess',
      color: '#556677',
      createdBy: '39c68f17-5ec0-435a-9038-749cc32279f7',
      updatedBy: null,
      createdAt: new Date(),
      updatedAt: new Date()

    }

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
