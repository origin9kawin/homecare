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
    return queryInterface.bulkInsert('HomeStatus', [
      {
        id: uuidv4(),
        name: "Open",
        desc: "รับเรื่อง",
        color: '#B389FB',
        initState: true,
        ordering: 1,
        filterAble: false,
        selectAble: false,
        reasonBtn: false,
        createdBy: createdBy,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Checking",
        desc: "เข้าตรวจ",
        color: '#F27B06',
        initState: true,
        ordering: 2,
        filterAble: true,
        selectAble: false,
        reasonBtn: false,
        createdBy: createdBy,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Assigned",
        desc: "เข้าตรวจ",
        color: '#FBBD0A',
        initState: false,
        ordering: 3,
        filterAble: true,
        selectAble: false,
        reasonBtn: false,
        createdBy: createdBy,
        createdAt: new Date(),
      },
      // {
      //   id: uuidv4(),
      //   name: "Checking",
      //   color: '#F27B06',
      //   initState: false,
      //   ordering: 4,
      //   filterAble: true,
      //   selectAble: false,
      //   createdBy: createdBy,
      //   createdAt: new Date(),
      // },
      {
        id: uuidv4(),
        name: "Inprocess",
        desc: "เข้าซ่อม",
        color: '#59B8FD',
        initState: false,
        ordering: 4,
        filterAble: true,
        selectAble: true,
        reasonBtn: false,
        createdBy: createdBy,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Hold-Customer",
        desc: "เข้าซ่อม",
        color: '#D60000',
        initState: false,
        ordering: 5,
        filterAble: true,
        selectAble: true,
        reasonBtn: true,
        createdBy: createdBy,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Hold-No workday",
        desc: "เข้าซ่อม",
        color: '#2d294f',
        initState: false,
        ordering: 6,
        filterAble: true,
        selectAble: true,
        reasonBtn: true,
        createdBy: createdBy,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Re-inprocess",
        desc: "เข้าซ่อม",
        color: '#bc3ab8',
        initState: false,
        ordering: 7,
        filterAble: true,
        selectAble: true,
        reasonBtn: false,
        createdBy: createdBy,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Finish",
        desc: "เข้าซ่อม",
        color: '#22BA46',
        initState: false,
        ordering: 8,
        filterAble: true,
        selectAble: false,
        reasonBtn: false,
        createdBy: createdBy,
        createdAt: new Date(),
      }
    ], {})
  },
  down: (queryInterface, Sequelize) => {
  }
};
