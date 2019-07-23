'use strict';
const models = require('../models')
const uuidv4 = require('uuid/v4');
const Sequelize = require('sequelize')
async function xcreatedBy() {
  const user = await models.HomeUser.findAll({
    attributes: ['id'],
    where: {
      visible: true,
    },
    order: [
      [Sequelize.literal('RAND()')]
    ],
    limit: 1,
  })
    .then((result) => {
      return result[0].get().id
    })
  return user
}
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const createdBy = await xcreatedBy();
    return queryInterface.bulkInsert('HomeReasons', [{
      id: uuidv4(),
      name: 'ติดต่อไม่ได้',
      color: '#' + Math.floor(Math.random() * 0x1000000).toString(16),
      initState: true,
      createdBy: createdBy,
    }, {
      id: uuidv4(),
      name: 'ติดต่อกลับ',
      color: '#' + Math.floor(Math.random() * 0x1000000).toString(16),
      createdBy: createdBy,
    }, {
      id: uuidv4(),
      name: 'ไม่สะดวก',
      color: '#' + Math.floor(Math.random() * 0x1000000).toString(16),
      createdBy: createdBy,
    }, {
      id: uuidv4(),
      name: 'รอคิวช่าง',
      color: '#' + Math.floor(Math.random() * 0x1000000).toString(16),
      createdBy: createdBy,
    }, {
      id: uuidv4(),
      name: 'รอของ',
      color: '#' + Math.floor(Math.random() * 0x1000000).toString(16),
      createdBy: createdBy,
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
