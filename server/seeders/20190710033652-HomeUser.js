'use strict';
const models = require('../models')
const uuidv4 = require('uuid/v4');
const Promise = require('bluebird')
const faker = require('faker');
const bcrypt = require('bcrypt')
const ms = require('ms')
const mock = require('../config/mock')
function userExpiredAt(userExpiredIn) {
  var seconds = ms(userExpiredIn) / 1000
  var now = new Date();
  now.setSeconds(now.getSeconds() + seconds);
  var feature = new Date(now);
  return feature;
}
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = []
    var textPwd = '';
    var hashPwd = '';
    for (let i = 0; i < mock.MOCK_DATA_GENERATE; i++) {
      textPwd = faker.internet.userName();
      hashPwd = await bcrypt.hash(textPwd, bcrypt.genSaltSync(10));
      users.push({
        firstname: faker.name.findName(),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        hashPwd: hashPwd,
        genTestTextPwd: textPwd,
        visible: faker.random.boolean(),
      })
    }
    // for test user
    users.push({
      firstname: 'มานี มานะ',
      username: 'demo',
      email: 'demo@electronics.email.com',
      hashPwd: await bcrypt.hash('12345', bcrypt.genSaltSync(10)),
      visible: true,
      genTestTextPwd: '12345'
    })
    // end data structure
    const buildQueries = () => {
      let queries = [];
      users.forEach(user => {
        queries.push({
          firstname: user.firstname,
          username: user.username,
          email: user.email,
          hashPwd: user.hashPwd,
          userExpiredAt: userExpiredAt('1y'),
          visible: user.visible,
          genTestTextPwd: user.genTestTextPwd
        })
      });
      return queries;
    };
    const apiCall = (item) => {
      return new Promise(async (resolve, reject) => {
        await Promise.delay(1000);
        resolve(
          // item
          await models.HomeUser.create({
            id: uuidv4(),
            firstname: item.firstname,
            username: item.username,
            email: item.email,
            hashPwd: item.hashPwd,
            userExpiredAt: item.userExpiredAt,
            visible: item.visible,
            genTestTextPwd: item.genTestTextPwd
          })
        ) // resolve
      });
    };
    const queries = buildQueries();
    return Promise.map(queries, async query => {
      await apiCall(query);
      // console.log(await apiCall(query));
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
