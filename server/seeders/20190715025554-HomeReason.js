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
    return queryInterface.bulkInsert('HomeReasons', [{
      id: uuidv4(),
      name: 'ติดต่อไม่ได้',
      color: '#112233',
      createdBy: '323fdba0-a3d8-11e9-9d13-b1bc66139611',
      updatedBy: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuidv4(),
      name: 'ติดต่อกลับ',
      color: '#223344',
      createdBy: '323fdba0-a3d8-11e9-9d13-b1bc66139611',
      updatedBy: '323fdba0-a3d8-11e9-9d13-b1bc66139611',
      createdAt: new Date(),
      updatedAt: new Date()

    }, {
      id: uuidv4(),
      name: 'ไม่สะดวก',
      color: '#334455',
      createdBy: '323fdba0-a3d8-11e9-9d13-b1bc66139611',
      updatedBy: '073e220c-7db7-48f5-a525-49c9ffec3e2d',
      createdAt: new Date(),
      updatedAt: new Date()

    }, {
      id: uuidv4(),
      name: 'รอคิวช่าง',
      color: '#445566',
      createdBy: '323fdba0-a3d8-11e9-9d13-b1bc66139611',
      updatedBy: null,
      createdAt: new Date(),
      updatedAt: new Date()

    }, {
      id: uuidv4(),
      name: 'รอของ',
      color: '#556677',
      createdBy: '323fdba0-a3d8-11e9-9d13-b1bc66139611',
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
