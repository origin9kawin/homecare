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
    return queryInterface.bulkInsert('HomeStatus', [{
      id: uuidv4(),
      name: "Assign",
      color: '#' + Math.floor(Math.random() * 0x1000000).toString(16),
      initState: true,
      createdBy: createdBy,
    }, {
      id: uuidv4(),
      name: "Checking",
      color: '#' + Math.floor(Math.random() * 0x1000000).toString(16),
      createdBy: createdBy,
    }, {
      id: uuidv4(),
      name: "Inprocess",
      color: '#' + Math.floor(Math.random() * 0x1000000).toString(16),
      createdBy: createdBy,
    }, {
      id: uuidv4(),
      name: "Hold-Customer",
      color: '#' + Math.floor(Math.random() * 0x1000000).toString(16),
      createdBy: createdBy,
    }, {
      id: uuidv4(),
      name: "Hold-No workday",
      color: '#' + Math.floor(Math.random() * 0x1000000).toString(16),
      createdBy: createdBy,

    }, {
      id: uuidv4(),
      name: "Re-inprocess",
      color: '#' + Math.floor(Math.random() * 0x1000000).toString(16),
      createdBy: createdBy,
    }, {
      id: uuidv4(),
      name: "Finish",
      color: '#' + Math.floor(Math.random() * 0x1000000).toString(16),
      createdBy: createdBy,
    }
    ], {})
  },
  down: (queryInterface, Sequelize) => {
  }
};
