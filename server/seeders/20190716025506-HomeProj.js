'use strict';
const models = require('../models')
const uuidv4 = require('uuid/v4');
const Promise = require('bluebird')
const faker = require('faker');
const Sequelize = require('sequelize')
const mock = require('../config/mock')
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
    // await createdBy()
    const data = []
    for (let i = 0; i < mock.MOCK_DATA_GENERATE; i++) {
      data.push({
        // name: faker.address.city(),
        // name: faker.address.streetAddress(),
        name: faker.commerce.productName(),
        color: faker.internet.color(),
        createdBy: await xcreatedBy(),
      })
    }
    // end data structure
    const buildQueries = () => {
      let queries = [];
      data.forEach(value => {
        queries.push({
          name: value.name,
          color: value.color,
          createdBy: value.createdBy,
        })
      });
      return queries;
    };
    const apiCall = (item) => {
      return new Promise(async (resolve, reject) => {
        await Promise.delay(1000);
        resolve(
          // item
          await models.HomeProj.findOrCreate({
            where: {
              name: item.name,
            },
            defaults: {
              id: uuidv4(),
              name: item.name,
              color: item.color,
              createdBy: item.createdBy,
              createdAt: new Date(),
              // updatedAt: new Date(),
            }
          })
        ) // resolve
      });
    };
    const queries = buildQueries();
    return Promise.map(queries, async query => {
      await apiCall(query)
    }, { concurrency: 5 }); // five at the time
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
