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
    return queryInterface.bulkInsert('HomeCaseDets', [{
      id: uuidv4(),
      caseId: '9a4a062e-b802-43a0-808d-e9ba99ceccbb',
      catId: '055e36dc-67ad-4e40-b111-aab9c519b230',
      subcatId: 'b3f45601-513a-4896-91c1-8dc3816481d6',
      statusId: 'd1ecb812-3f21-46e4-838b-6a42fa7ecb01',
      reasonId: '895147bc-e141-4391-8ac9-36a73354e384',
      description: 'มีช่องว่างระหว่างตู้',
      homecareName: "นันทิกานต์ ปุญญานันท์",
      homecareInDate: new Date(),
      checkDetail: 'ช่วยแก้ไขงานให้ละเอียดด้วย',
      singOwner: 'singowner',
      listDefect: 'listdefect',
      remark: 'remark',
      slaDay: 1,
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
