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
    for (let i = 0; i < mock.MOCK_DATA_GENERATE_USER; i++) {
      textPwd = faker.internet.userName();
      hashPwd = await bcrypt.hash(textPwd, bcrypt.genSaltSync(10));
      users.push({
        firstname: faker.name.findName(),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        role: 1,
        hashPwd: hashPwd,
        genTestTextPwd: textPwd,
        visible: faker.random.boolean(),
      })
    }
    // for test user
    const genTestTextPwd = '12345'
    users.push({
      firstname: 'แอดมิน',
      username: 'admin',
      email: 'admin@homecare.com',
      role: 0,
      hashPwd: await bcrypt.hash(genTestTextPwd, bcrypt.genSaltSync(10)),
      visible: true,
      genTestTextPwd: genTestTextPwd
    })
    users.push({
      firstname: 'กุสุมา',
      username: 'opener',
      email: 'opener@homecare.com',
      role: 1,
      hashPwd: await bcrypt.hash(genTestTextPwd, bcrypt.genSaltSync(10)),
      visible: true,
      genTestTextPwd: genTestTextPwd
    })
    users.push({
      firstname: 'นายตรวจ',
      username: 'checker',
      email: 'checker@homecare.com',
      role: 2,
      hashPwd: await bcrypt.hash(genTestTextPwd, bcrypt.genSaltSync(10)),
      visible: true,
      genTestTextPwd: genTestTextPwd
    })
    users.push({
      firstname: 'ช่างเอก',
      username: 'operator1',
      email: 'operator1@homecare.com',
      role: 3,
      hashPwd: await bcrypt.hash(genTestTextPwd, bcrypt.genSaltSync(10)),
      visible: true,
      genTestTextPwd: genTestTextPwd
    })
    users.push({
      firstname: 'ช่างกร',
      username: 'operator2',
      email: 'operator2@homecare.com',
      role: 3,
      hashPwd: await bcrypt.hash(genTestTextPwd, bcrypt.genSaltSync(10)),
      visible: true,
      genTestTextPwd: genTestTextPwd
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
          role: user.role,
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
            role: item.role,
            userExpiredAt: item.userExpiredAt,
            visible: item.visible,
            genTestTextPwd: item.genTestTextPwd,
            createdAt: new Date(),
            // updatedAt: new Date()
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
