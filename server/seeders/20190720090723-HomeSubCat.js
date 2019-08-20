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
    const category = []
    for (let i = 0; i < mock.MOCK_DATA_GENERATE; i++) {
      const subcategories = []
      var creater = await xcreatedBy();
      for (let j = 0; j < mock.MOCK_DATA_GENERATE; j++) {
        subcategories.push(
          {
            name: faker.commerce.product(),
            color: faker.internet.color(),
            slaDay: 1,
            createdBy: creater,
          }
        )
      }
      category.push({
        name: faker.commerce.productMaterial(),
        color: faker.internet.color(),
        slaDay: 1,
        createdBy: creater,
        subcategory: subcategories
      })
    }
    // end data structure
    const buildQueries = () => {
      let queries = [];
      category.forEach(ele => {
        let subcats = []
        ele.subcategory.forEach(sub => {
          subcats.push({
            name: sub.name,
            color: sub.color,
            slaDay: ele.slaDay,
            createdBy: sub.createdBy
          })
        })
        queries.push({
          name: ele.name,
          color: ele.color,
          slaDay: ele.slaDay,
          createdBy: ele.createdBy,
          subcategory: subcats
        })
      });
      return queries;
    };
    const apiCall = (item) => {
      return new Promise(async (resolve, reject) => {
        await Promise.delay(1000);
        resolve(
          await models.HomeCate.findOrCreate({
            attributes: ['id'],
            where: {
              name: item.name,
            },
            defaults: {
              id: uuidv4(),
              color: item.color,
              slaDay: item.slaDay,
              createdBy: item.createdBy,
              createdAt: new Date(),
            },
            limit: 1,
          },
          )
            .spread(async (homecate, created) => {
              if (created) {
                var data = [];
                item.subcategory.forEach(function (subcate) {
                  data.push({
                    id: uuidv4(),
                    name: subcate.name,
                    color: subcate.color,
                    slaDay: subcate.slaDay,
                    maincatId: homecate.get().id,
                    createdBy: subcate.createdBy,
                    createdAt: new Date(),
                  });
                })
                await models.HomeSubCat.bulkCreate(data, {
                  updateOnDuplicate: ['maincatId', 'name']
                })
              }
            })
        );
      });
    };
    const queries = buildQueries();
    return Promise.map(queries, async query => {
      // console.log(await apiCall(query));
      await apiCall(query);
    }, { concurrency: 5 }); // five at the time

  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('HomeCate', null, {});
    await queryInterface.bulkDelete('HomeSubCat', null, {});
  }
};
