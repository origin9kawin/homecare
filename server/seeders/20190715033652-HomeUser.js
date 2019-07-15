'use strict';

const uuidv4 = require('uuid/v4');
const ms = require('ms');

function userExpiredAt(userExpiredIn) {
  var seconds = ms(userExpiredIn) / 1000
  var now = new Date();
  now.setSeconds(now.getSeconds() + seconds);
  var feature = new Date(now);
  return feature;
}

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
    return queryInterface.bulkInsert('HomeUser', [{
      id: uuidv4(),
      firstname: 'มานี มานะ',
      username: 'demo',
      email: 'a1@9kawin.co.th',
      hashPwd: '$2b$10$0qFndep5gyulBE/54ajPP.vw4AmytNJHgj2rXJNDLxJfC70ceZINu',
      loginToken: null,
      verifyToken: null,
      userExpiredAt: userExpiredAt('30d'),
      createdBy: null,
      updatedBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      visible: false,
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
